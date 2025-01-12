import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, View, TouchableOpacity, Text, ScrollView, Linking } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [displayedResults, setDisplayedResults] = useState(10);

  const searchNews = async (searchQuery: string) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const fromDate = lastWeek.toISOString().split('T')[0];

    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&from=${fromDate}&apiKey=183daca270264bad86fc5b72972fb82a`);
      const data = await response.json();
      const filteredArticles = data.articles.filter(article => article.title !== '[Removed]' && article.url !== 'https://removed.com');
      setResults(filteredArticles);
      setDisplayedResults(10); // Reset displayed results count
    } catch (error) {
      console.error(error);
    }
  };

  const loadMoreResults = () => {
    setDisplayedResults(prevCount => prevCount + 10);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/newspaper.jpg')}
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
        {results.slice(0, displayedResults).map((article, index) => (
          <TouchableOpacity key={index} style={styles.card} onPress={() => Linking.openURL(article.url)}>
            {article.urlToImage && (
              <Image source={{ uri: article.urlToImage }} style={styles.cardImage} />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardDescription}>{article.description}</Text>
              <Text style={styles.cardDate}>{new Date(article.publishedAt).toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {displayedResults < results.length && (
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreResults}>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        )}
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
    borderWidth: 1,
    borderColor: '#d3d3d3',
    width: '100%',
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
  loadMoreButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    margin: 16,
    alignItems: 'center',
  },
  loadMoreButtonText: {
    color: 'white',
  },
  reactLogo: {
    height: 400,
    width: 800,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  stickyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 1,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
});
