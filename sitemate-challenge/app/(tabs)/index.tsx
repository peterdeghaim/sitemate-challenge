import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { NEWSAPI_KEY } from '@env';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const searchNews = async (searchQuery: string) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const fromDate = lastWeek.toISOString().split('T')[0];

    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&from=${fromDate}&apiKey=$(NEWSAPI_KEY)`);
      const data = await response.json();
      const filteredArticles = data.articles.filter(article => article.title !== '[Removed]');
      setResults(filteredArticles);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Newgle</ThemedText>
      </ThemedView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search News"
          value={query}
          onChangeText={(text) => setQuery(text)}
          onSubmitEditing={() => searchNews(query)}
        />
        <TouchableOpacity style={styles.button} onPress={() => searchNews(query)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.resultsContainer}>
        {results.map((article, index) => (
          <View key={index} style={styles.card}>
            {article.urlToImage && (
              <Image source={{ uri: article.urlToImage }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardDescription}>{article.description}</Text>
              <Text style={styles.cardDate}>{new Date(article.publishedAt).toLocaleDateString()}</Text>
              <TouchableOpacity style={styles.articleButton} onPress={() => Linking.openURL(article.url)}>
                <Text style={styles.articleButtonText}>Read More</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  button: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
  resultsContainer: {
    margin: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    height: 200,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 8,
  },
  articleButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  articleButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
