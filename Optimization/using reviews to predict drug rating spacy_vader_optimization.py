import pandas as pd
from nltk.corpus import stopwords
from sklearn.model_selection import train_test_split
import numpy as np
import spacy
from spacy.lang.en import English
import string

from sklearn.ensemble import VotingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier
from sklearn.feature_extraction.text import CountVectorizer,TfidfVectorizer,HashingVectorizer
from sklearn.base import TransformerMixin
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
import ssl
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# preprocessing the data file
#  read the data
df1 = pd.read_csv("C:/Fall19/CS5007_Introto Prming/Project/drugsComTrain_raw.csv")
df2 = pd.read_csv("C:/Fall19/CS5007_Introto Prming/Project/drugsComTest_raw.csv")
# combine two file
df = pd. concat([df1, df2])
# rename the cols
df.columns = ['ID','drug name','condition','review','rating','date','useful count']
# # keep the useful columns in new df
# n_df = df[['ID','drug name','review','rating']].copy()
# we will delete the rows so that the data does not overfits
df = df.dropna(axis = 0)
# create new df with columns drugName, condition, review, category_id
col = ['drug name','condition', 'review','rating']
df = df[col]
df = df[pd.notnull(df['review'])]
df.columns = ['drug name','condition', 'review','rating']
df['category_id'] = df['condition'].factorize()[0]
# top 20 list = [2, 9, 24, 39, 40, 6, 17, 73, 12, 1, 33, 5, 54, 19, 72, 28, 14, 38, 23, 52], same as prediction condition, size of the data (126129, 6) compare to original (213869, 5)
df20 = df[(df['category_id'] == 2) | (df['category_id'] == 9)| (df['category_id'] == 24) | (df['category_id'] == 39)
         | (df['category_id'] == 40) | (df['category_id'] == 6) | (df['category_id'] == 17) | (df['category_id'] == 73)
         | (df['category_id'] == 12) | (df['category_id'] == 1) | (df['category_id'] == 33) | (df['category_id'] == 5)
         | (df['category_id'] == 54) | (df['category_id'] == 19) | (df['category_id'] == 72) | (df['category_id'] == 28)
         | (df['category_id'] == 14) | (df['category_id'] == 38) | (df['category_id'] == 23) | (df['category_id'] == 52)].copy()
df20 = df20.drop(columns=['condition'])

# text cleaning for review
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
# Vectorization Feature(bow,tfidf)
#  bag of words vector (parameter ngram_range)
bow_vector = CountVectorizer(tokenizer = spacy_tokenizer, ngram_range=(1,2))
#  tf-idf vector
tfidf_vector = TfidfVectorizer(tokenizer = spacy_tokenizer)
# remove the stopwords from the review, build a new col called c_review
df20['c_review'] = df20['review'].apply(lambda x: ' '.join([item for item in x.split() if item not in stop_words]))

# create new col vaderReviewScore based on C-review
analyzer = SentimentIntensityAnalyzer()
df20['vaderReviewScore'] = df20['c_review'].apply(lambda x: analyzer.polarity_scores(x)['compound'])

# split the df20
features = df20['c_review'] # the features we want to analyze
labels = df20['rating'] # the labels, we want to test against
X_train, X_test, y_train, y_test, indices_train, indices_test = train_test_split(features, labels, df20.index, test_size=0.2, random_state=0)

# models
#clf1 = RandomForestClassifier(n_estimators=200,max_depth=3,random_state=0)
clf2 = LinearSVC(random_state= 0 , max_iter=10000)
clf3 = LogisticRegression(random_state=0,solver='lbfgs',max_iter=2000,multi_class='auto')
#clf3 = LogisticRegression(random_state=0,solver='lbfgs',max_iter=1000,multi_class='auto',penalty = 'l2')
#clf4 = DecisionTreeClassifier(random_state=0)
#clf5 = MultinomialNB()
clf7 = SGDClassifier(loss='hinge', penalty='l2', alpha=1e-3, random_state=42, max_iter=10, tol=None)
# names=["RandomForestClassifier","LinearSVC","LogisticRegression","DecisionTreeClassifier","MultinomialNB"]
# # for RandomForestClassifier
# pipe1 = Pipeline([("cleaner", predictors()),
#                 ('vectorizer', bow_vector),
#                 ('classifier', clf1)])
# pipe1.fit(X_train, y_train)
# y_pred1 = pipe1.predict(X_test)
# print("Random Forest: ", accuracy_score(y_test, y_pred1))
# # Random Forest:  0.3142330166307599 (with all data, probably overfitting)
# # Random Forest:  0.2911851620498282 (nltk, with df20,ngram(2,4),testsize=0.3)
# # Random Forest:  0.2909432067443643 (nltk, with df20,ngram(1,2),testsize=0.3)
# # Random Forest:  0.2911851620498282 （nltk, with df20,ngram(1,2),testsize=0.33）

# for LinearSVC
pipe2 = Pipeline([('cleaner', predictors()),
                ('vectorizer', bow_vector),
                ('classifier', clf2)])
pipe2.fit(X_train, y_train)
y_pred2 = pipe2.predict(X_test)
svc_accuracy =  accuracy_score(y_test, y_pred2)
print("LinearSVC: ",svc_accuracy)
# # LinearSVC:  0.7334738604132116 (nltk,with all data, overfitting)
# # LinearSVC:  0.7434921641692434 (nltk,with df20,ngram(1,2),testsize=0.3)
# # LinearSVC:  0.722509189630733 (nltk,with df20,ngram(2,4),testsize=0.33)
# # LinearSVC:  0.7129711938111141(spacy,with df20,ngram(1,2),testsize=0.33)

# # for LogisticRegression
pipe3 = Pipeline([
                ('vectorizer', bow_vector),
                ('classifier', clf3)])
pipe3.fit(X_train, y_train)
y_pred3 = pipe3.predict(X_test)
logreg_accuracy = accuracy_score(y_test, y_pred3)
print("LogisticRegression: ", logreg_accuracy)

# # for DecisionTreeClassifier
# pipe4 = Pipeline([
#                 ('vectorizer', tfidf),
#                 ('classifier', clf4)])
# pipe4.fit(X_train, y_train)
# y_pred4 = pipe4.predict(X_test)
# print("DecisionTreeClassifier: ", accuracy_score(y_test, y_pred4))
#
# # for MultinomialNB
# pipe5 = Pipeline([
#                 ('vectorizer', tfidf),
#                 ('classifier', clf5)])
# pipe5.fit(X_train, y_train)
# y_pred5 = pipe5.predict(X_test)
# print("MultinomialNB: ", accuracy_score(y_test, y_pred5))
# # SGD
pipe7 = Pipeline([("cleaner", predictors()),
                 ('vectorizer', bow_vector),
                 ('classifier', clf7)])
pipe7.fit(X_train, y_train)
y_pred7 = pipe7.predict(X_test)
sgd_accuracy = accuracy_score(y_test, y_pred7)
print("SGD: ", sgd_accuracy)
finalpred=(svc_accuracy*0.4+sgd_accuracy*0.15+logreg_accuracy*0.45)
print("Combined Weights model prediction accuracy: ",finalpred)

# # # #Optimization
# estimators=[('clf2', y_pred2), ('clf3', y_pred3), ('clf7', y_pred7)]
#  # #
# # # # #create our voting classifier, inputting our models
# ensemble = VotingClassifier(estimators, voting='hard')
# # # #
# # # # #fit model to training data
# ensemble.fit(X_train, y_train)
# # # #
# # # # #test our model on the test data
# print(ensemble.score(X_test, y_test))