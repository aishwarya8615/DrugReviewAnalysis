import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import itertools
import spacy
from spacy.lang.en import English
import string
from sklearn.base import TransformerMixin
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from mlxtend.plotting import plot_decision_regions
from sklearn.model_selection import train_test_split
from sklearn.model_selection import GridSearchCV
from sklearn.feature_selection import chi2
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score
from mlxtend.classifier import StackingClassifier
from sklearn.model_selection import cross_val_score, train_test_split
import matplotlib.gridspec as gridspec
from sklearn.ensemble import VotingClassifier
from sklearn.metrics import confusion_matrix
import seaborn as sns
from sklearn import metrics
import ssl
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context


# preprocessing the data file
#  read the data
df1 = pd.read_csv('C:/Fall19/CS5007_Introto Prming/Project/drugsComTrain_raw.csv')
df2 = pd.read_csv("C:/Fall19/CS5007_Introto Prming/Project/drugsComTest_raw.csv")
# combine two file
df = pd. concat([df1, df2])
# rename the cols
df.columns = ['ID','drugName','condition','review','rating','date','useful count']
# keep the useful columns in new df
df = df[['drugName','condition', 'review']].copy()

# create a list of stopwords
nlp = spacy.load('en_core_web_sm')
stop_words = spacy.lang.en.stop_words.STOP_WORDS
parser = English()
punctuations = string.punctuation
# Creating our tokenizer function
def spacy_tokenizer(sentence):
    # Creating our token object, which is used to create documents with linguistic annotations.
    mytokens = parser(sentence)

    # Lemmatizing each token and converting each token into lowercase
    mytokens = [ word.lemma_.lower().strip() if word.lemma_ != "-PRON-" else word.lower_ for word in mytokens ]

    # Removing stop words
    mytokens = [ word for word in mytokens if word not in stop_words and word not in punctuations ]

    # return preprocessed list of tokens
    return mytokens

# Custom transformer using spaCy
class predictors(TransformerMixin):
    def transform(self, X, **transform_params):
        # Cleaning Text
        return [clean_text(text) for text in X]

    def fit(self, X, y=None, **fit_params):
        return self

    def get_params(self, deep=True):
        return {}

# Basic function to clean the text
def clean_text(text):
    # Removing spaces and converting text into lowercase
    return text.strip().lower()

# remove the stopwords from the review, build a new col called c_review
df['c_review'] = df['review'].apply(lambda x: ' '.join([item for item in x.split() if item not in stop_words]))

df['category_id'] = df['condition'].factorize()[0]
df_condition = df.groupby(['condition'])['drugName'].nunique().sort_values(ascending=False)
df_condition = pd.DataFrame(df_condition).reset_index()

# setting a df with conditions with only one drug
df_condition_1 = df_condition[df_condition['drugName'] == 1].reset_index()
all_list = set(df.index)
# deleting them
condition_list = []
for i, j in enumerate(df['condition']):
    for c in list(df_condition_1['condition']):
        if j == c:
            condition_list.append(i)

new_idx = all_list.difference(set(condition_list))
df = df.iloc[list(new_idx)].reset_index()
del df['index']

# print out the top 20 conditions
plt.figure(figsize=(20,5));
count_by_occ = df.groupby('category_id').size()
print(count_by_occ.sort_values(ascending=False)[:20])
# only keep the corresponding rows with top20 conditions
# top 20 list = [2, 9, 24, 39, 40, 6, 17, 73, 12, 1, 33, 5, 54, 19, 72, 28, 14, 38, 23, 52]
df20 = df[(df['category_id'] == 2) | (df['category_id'] == 9)| (df['category_id'] == 24) | (df['category_id'] == 39)
         | (df['category_id'] == 40) | (df['category_id'] == 6) | (df['category_id'] == 17) | (df['category_id'] == 73)
         | (df['category_id'] == 12) | (df['category_id'] == 1) | (df['category_id'] == 33) | (df['category_id'] == 5)
         | (df['category_id'] == 54) | (df['category_id'] == 19) | (df['category_id'] == 72) | (df['category_id'] == 28)
         | (df['category_id'] == 14) | (df['category_id'] == 38) | (df['category_id'] == 23) | (df['category_id'] == 52)]

# Vectorization Feature(bow,tfidf)
#  bag of words vector (parameter ngram_range)
bow_vector = CountVectorizer(tokenizer = spacy_tokenizer, ngram_range=(1,2))
#  tf-idf vector
tfidf_vector = TfidfVectorizer(tokenizer = spacy_tokenizer)

# text representation
# split the df20
features = df20['c_review'] # the features we want to analyze
labels = df20['condition'] # the labels, we want to test against
X_train, X_test, y_train, y_test, indices_train, indices_test = train_test_split(features, labels, df20.index, test_size=0.2, random_state=0)

category_id_df = df20[['condition', 'category_id']].drop_duplicates().sort_values('category_id')
category_to_id = dict(category_id_df.values)
id_to_category = dict(category_id_df[['category_id', 'condition']].values)

# model selection
#clf1 = MultinomialNB()
clf2 = LogisticRegression(random_state=0,solver='lbfgs',max_iter=2000,multi_class='auto')
clf3 = SVC(kernel="linear", C=0.025)
#clf4 = KNeighborsClassifier(3)
#clf5 = RandomForestClassifier(max_depth=20, n_estimators=20, max_features=1)
#clf6 = AdaBoostClassifier()
clf7 = SGDClassifier(loss='hinge', penalty='l2', alpha=1e-3, random_state=42, max_iter=10, tol=None)

# Naive Bayes
# pipe1 = Pipeline([("cleaner", predictors()),
#                  ('vectorizer', bow_vector),
#                  ('classifier', clf1)])
# pipe1.fit(X_train, y_train)
# y_pred1 = pipe1.predict(X_test)
# print("Naive Bayes: ", accuracy_score(y_test, y_pred1))

# Logistic Regression
pipe2 = Pipeline([("cleaner", predictors()),
                 ('vectorizer', bow_vector),
                 ('classifier', clf2)])
pipe2.fit(X_train, y_train)
y_pred2 = pipe2.predict(X_test)

logreg_accuracy = accuracy_score(y_test, y_pred2)
print("Log Reg: ", logreg_accuracy )
# # Linear SVM
pipe3 = Pipeline([("cleaner", predictors()),
                 ('vectorizer', bow_vector),
                 ('classifier', clf3)])
#create a dictionary of all values we want to test for n_estimators
#params_svm = {'n_estimators': [50, 100, 200]}
#use gridsearch to test all values for n_estimators
#svm_gs = GridSearchCV(clf3, params_svm, cv=5)
#fit model to training data
#pipe3.fit(X_train, y_train)
#save best model

#svm_best = svm_gs.best_estimator_
#check best n_estimators value
#print(svm_gs.best_params_)
pipe3.fit(X_train, y_train)
y_pred3 = pipe3.predict(X_test)
svc_accuracy = accuracy_score(y_test, y_pred3)
print("Linear SVM: ",svc_accuracy )

# # Nearest Neighbor
# pipe4 = Pipeline([("cleaner", predictors()),
#                  ('vectorizer', bow_vector),
#                  ('classifier', clf4)])
# pipe4.fit(X_train, y_train)
# y_pred4 = pipe4.predict(X_test)
# print("Nearest Neighbor: ", accuracy_score(y_test, y_pred4))
#
# # Random Forest
# pipe5 = Pipeline([("cleaner", predictors()),
#                  ('vectorizer', bow_vector),
#                  ('classifier', clf5)])
# pipe5.fit(X_train, y_train)
# y_pred5 = pipe5.predict(X_test)
# print("Random Forest: ", accuracy_score(y_test, y_pred5))
#
# # AdaBoost
# pipe6 = Pipeline([("cleaner", predictors()),
#                  ('vectorizer', bow_vector),
#                  ('classifier', clf6)])
# pipe6.fit(X_train, y_train)
# y_pred6 = pipe6.predict(X_test)
# print("AdaBoost testing accuracy: ", accuracy_score(y_test, y_pred6))

# # SGD
pipe7 = Pipeline([("cleaner", predictors()),
                 ('vectorizer', bow_vector),
                 ('classifier', clf7)])
pipe7.fit(X_train, y_train)
y_pred7 = pipe7.predict(X_test)
sgd_accuracy = accuracy_score(y_test, y_pred7)
print("SGD: ", sgd_accuracy)
finalpred=(svc_accuracy*0.25+sgd_accuracy*0.35+logreg_accuracy*0.4)
print("Combined Weights model prediction accuracy: ",finalpred)
#
# # #Optimization
# estimators=[('clf2', y_pred2), ('clf3', y_pred3), ('clf7', y_pred7)]
# #
# # #create our voting classifier, inputting our models
# ensemble = VotingClassifier(estimators, voting='hard')
# #
# # #fit model to training data
# ensemble.fit(X_train, y_train)
# #
# # #test our model on the test data
# print(ensemble.score(X_test, y_test))
# sclf = StackingClassifier(classifiers=[clf3, clf7],
#                           meta_classifier=clf2)
# label = ['Linear SVM', 'SGD', 'Log Reg','Stacking Classifier']
# clf_list = [clf3, clf7, clf2]
#
# fig = plt.figure(figsize=(10, 8))
# gs = gridspec.GridSpec(2, 2)
# grid = itertools.product([0, 1], repeat=2)
#
# clf_cv_mean = []
# clf_cv_std = []
# for clf, label, grd in zip(clf_list, label, grid):
#     scores = cross_val_score(clf, X_train, y_train, cv=3, scoring='accuracy')
#     print
#     "Accuracy: %.2f (+/- %.2f) [%s]" % (scores.mean(), scores.std(), label)
#     clf_cv_mean.append(scores.mean())
#     clf_cv_std.append(scores.std())
#
#     clf.fit(X_train, y_train)
#     ax = plt.subplot(gs[grd[0], grd[1]])
#     fig = plot_decision_regions(X=X_train, y=y_train, clf=clf)
#     plt.title(label)
#
# plt.show()
#



