import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import style; style.use('ggplot')
import dateutil.parser as parser
import re
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, roc_auc_score
from sklearn.naive_bayes import MultinomialNB, GaussianNB
from sklearn.feature_extraction.text import HashingVectorizer
from sklearn.feature_selection import chi2, SelectKBest
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from wordcloud import WordCloud, STOPWORDS
import spacy
import random
from spacy.util import minibatch,compounding

train = pd.read_csv('C:\Fall19\CS5007_Introto Prming\Project\kuc-hackathon-winter-2018/drugsComTrain_raw.csv')
test = pd.read_csv('C:\Fall19\CS5007_Introto Prming\Project\kuc-hackathon-winter-2018/drugsComTest_raw.csv')

conditions = train.condition.value_counts().sort_values(ascending=False)
conditions[:20]
conditions[:20].plot(kind='bar')
plt.title('Top 20 Most Common Conditions-Train')
plt.xlabel('Condition')
plt.ylabel('Count');
plt.show()


conditions = test.condition.value_counts().sort_values(ascending=False)
conditions[:20]
conditions[:20].plot(kind='bar')
plt.title('Top 20 Most Common Conditions - Test')
plt.xlabel('Condition')
plt.ylabel('Count');
plt.show()


#establish a dataframe to focus on birth control
BirthControlDf = train[['condition','rating','drugName']]
BirthControlDf=BirthControlDf.loc[BirthControlDf['condition'] == 'Birth Control']
BirthControlDf['drugName'].value_counts().nlargest(15)
train['year'] = [parser.parse(date).date().year for date in train['date']]
test['year'] = [parser.parse(date).date().year for date in test['date']]
commonCdf = train['condition'].value_counts().nlargest(15)
ConditionsDict = {}
ConditionsDictYearly = {}
conditions = list(commonCdf.index)[:5]
for condition in conditions:
    cdf = train[['condition','rating','drugName','year']].loc[train['condition'] == 'Birth Control']
    cdf.reset_index(drop=True)
    drugs = list(cdf['drugName'].value_counts().nlargest(5).index)
    ConditionsDict['Birth Control'] = [cdf.loc[cdf['drugName'] == drug].reset_index(drop=True) for drug in drugs]
    ConditionsDictYearly['Birth Control'] = [cdf.loc[cdf['drugName'] == drug].groupby(['year']).mean().reset_index() for drug in drugs]

for condition in ConditionsDict:
    drugs = [cdf.at[0, 'drugName'] for cdf in ConditionsDict[condition]]
    #fig = plt.figure(figsize=(10, 8))
    cdf = ConditionsDictYearly[condition]
    for i in range(len(drugs)):
        plt.plot(cdf[i]['year'], cdf[i]['rating'], label=drugs[i])
    plt.xlabel('Year')
    plt.ylabel('Ratings')
    plt.legend(loc='lower left')
    plt.title('Average annual ratings of the five most popular drugs for ' + condition)
plt.show()