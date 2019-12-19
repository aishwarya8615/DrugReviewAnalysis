import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib import style; style.use('ggplot')

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

comment_words = ' '
stopwords = set(STOPWORDS)
for review in test['review']:
    # typecaste each val to string
    review = str(review).lower()
    # split the value
    tokens = review.split()
    comment_words = comment_words + ' '.join(tokens)

wordcloud = WordCloud(width=800, height=800,
                          background_color='white',
                          stopwords=stopwords,
                          min_font_size=10).generate(comment_words)

    # plot the WordCloud image
plt.figure(figsize=(8, 8), facecolor=None)
plt.imshow(wordcloud)
plt.axis("off")
plt.tight_layout(pad=0)

plt.show()