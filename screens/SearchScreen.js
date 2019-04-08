import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Stars from 'react-native-stars';
import { Ionicons } from '@expo/vector-icons';
import { isCloseToBottom, convertToKM } from '../utils';

class SearchScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    restaurants: [],
    isFetching: false,
    reloadFetching: false,
    offset: 0,
    hasMore: true,
    searchText: '',
    hasSearched: false
  }

  searchBusinesses = async () => {
    this.setState({ isFetching: true });
    const { searchText } = this.state;
    const lowerSearch = searchText.toLowerCase();
    try {
      const Token = 'TK0O8hfa3qhhbvhcbI1SJgrpA637g2LNlPy9sQ7JirSLh4mp9mr6YXLmUVIF5GVF7uc8jf5UnQzJyj0Ftb7mIex9p_MMnS0WM3ENhLqapI0bJZ4x9q8WsgIZfZ6oXHYx';
      const response = await fetch(`https://api.yelp.com/v3/businesses/search?term=${lowerSearch}&latitude=37.786882&longitude=-122.399972`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Token}`
        })
      });
      console.log('response', response);
      const parsedResponse = JSON.parse(response._bodyInit);
      this.setState({
        restaurants: parsedResponse.businesses,
        isFetching: false,
        hasSearched: true,
        offset: 20
      })
    } catch (error) {
      console.log('error', error);
    }
  }

  getBusinesses = async () => {
    const { offset, restaurants, searchText } = this.state;
    this.setState({ reloadFetching: true });
    try {
      const Token = 'TK0O8hfa3qhhbvhcbI1SJgrpA637g2LNlPy9sQ7JirSLh4mp9mr6YXLmUVIF5GVF7uc8jf5UnQzJyj0Ftb7mIex9p_MMnS0WM3ENhLqapI0bJZ4x9q8WsgIZfZ6oXHYx';
      const response = await fetch(`https://api.yelp.com/v3/businesses/search?term=${searchText}&latitude=37.786882&longitude=-122.399972&offset=${offset}`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Token}`
        })
      });
      const parsedResponse = JSON.parse(response._bodyInit);
      this.setState({
        restaurants: restaurants.concat(parsedResponse.businesses),
        offset: offset + 20,
        hasMore: parsedResponse.total > restaurants.length,
        reloadFetching: false
      })
    } catch (error) {
      this.setState({ reloadFetching: false });
    }
  }

  render() {
    const { navigation } = this.props;
    const { restaurants, hasSearched, isFetching, hasMore, reloadFetching } = this.state;
    const height = Dimensions.get('screen').height;
    return (
      <View style={{ flex: 1, backgroundColor: '#DCDCDC' }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: '#DCDCDC'
          }}
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && hasMore) {
              this.getBusinesses();
            }
          }}
        >
        <View style={{
            display: 'flex',
            flex: 1,
            position: 'absolute',
            backgroundColor: '#FFA500',
            height: 130,
            zIndex: 20,
            width: '100%'
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row'
            }}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="ios-arrow-round-back"
                  size={25}
                  style={{
                    marginTop: 45,
                    marginLeft: 15
                  }}
                  color='#FFF'
                />
              </TouchableOpacity>
              <View style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 45,
                marginRight: 20,
                marginLeft: 15,
                borderBottomColor: '#FFF',
                borderBottomWidth: 1,
                width: '80%',
                }}
              >
                <TextInput
                  placeholder='Search for restaurants'
                  placeholderTextColor='#FFF'
                  style={{
                    color: '#FFF',
                  }}
                  onChangeText={(text) => this.setState({ searchText: text })}
                  onSubmitEditing={this.searchBusinesses}
                />
              </View>
            </View>
            <Text style={{
              marginLeft: 15,
              fontSize: 20,
              fontWeight: '700',
              color: '#FFF',
              marginTop: 20
            }}>Restaurants</Text>
          </View>
          <View style={{ marginTop: 150 }}>
            {
              !restaurants && <Text style={{
                textAlign: 'center',
                marginTop: 40
              }}>
              Could not fetch the restaurants. Kindly reload the view to re-fetch.
              </Text>
            }
            {
              restaurants.length === 0 && hasSearched && <Text style={{
                textAlign: 'center'
              }}>
                No restaurants found
              </Text>
            }
            {
              restaurants && restaurants.map(restaurant => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('BusinessDetails', { restaurant, distance: restaurant.distance })}
                  key={restaurant.id}
                  style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginBottom: 20,
                    backgroundColor: '#FFF',
                    paddingBottom: 15,
                    borderRadius: 5,
                    overflow: 'hidden',
                    ...Platform.select({
                      ios: {
                        shadowOffset: { width: 0, height: 1 },
                        shadowColor: 'gray',
                        shadowOpacity: 0.7,
                      },
                      android: {
                        elevation: 2
                      }
                    })
                  }}
                >
                <Image
                  source={{ uri: restaurant.image_url }}
                  style={{
                    height: 150,
                    marginBottom: 10
                  }}
                  />
                  <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 15, marginBottom: 15 }}>
                    <Text style={{
                      fontWeight: '700',
                      fontSize: 16,
                      opacity: .85,
                      flexWrap: 'wrap',
                      flex: 1
                    }}>{restaurant.name}</Text>
                    <Text style={{
                      marginLeft: 'auto',
                      marginRight: 10,
                      fontWeight: '600',
                      color: '#A9A9A9'
                    }}>{restaurant.categories ? restaurant.categories[0].title.toUpperCase() : 'N/A'}</Text>
                  </View>
                  <View style={{
                    display: 'flex',
                    flexDirection: 'row'
                  }}>
                    <Text style={{
                      marginLeft: 15,
                      marginRight: 5,
                      color: '#FFA500'
                    }}>{restaurant.rating.toFixed(1)}</Text>
                    <Stars
                      count={5}
                      default={restaurant.rating}
                      half={true}
                      starSize={12}
                      fullStar={<Ionicons name='ios-star' style={{ color: '#FFA500', marginTop: 3 }} />}
                      halfStar={<Ionicons name="ios-star-half" style={{ color: '#FFA500', marginTop: 3 }} />}
                      emptyStar={<Ionicons name="ios-star-outline" style={{ color: '#FFA500', marginTop: 3 }} />}
                    />
                  </View>
                  <Text style={{
                    position: 'absolute',
                    color: '#FFF',
                    marginTop: 15,
                    marginLeft: 15,
                    fontWeight: '600'
                  }}>{convertToKM(restaurant.distance)}</Text>
                  <Ionicons
                    name='ios-heart-empty'
                    size={20}
                    style={{
                      position: 'absolute',
                      right: 0,
                      marginRight: 15,
                      top: 15
                    }}
                    color='#FFF'
                  />
                </TouchableOpacity>
              ))
            }
            </View>
          { reloadFetching && <ActivityIndicator color='#FFA500' size='large' style={{ alignSelf: 'center' }} /> }
        </ScrollView>
        { isFetching &&
          <ActivityIndicator
            style={{
              position: 'absolute',
              top: height / 2,
              alignSelf: 'center'
            }}
            color='#FFA500'
            size='large'
          />
        }
      </View>
    )
  }
}

export default SearchScreen;
