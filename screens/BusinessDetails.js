import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Platform, Dimensions, PanResponder } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import Stars from 'react-native-stars';
import { MapView } from 'expo';

class BusinessDetails extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    isFetching: false,
    restaurantObject: {}
  }

  async componentDidMount() {
    const restaurant = this.props.navigation.getParam('restaurant');
    try {
      const Token = 'TK0O8hfa3qhhbvhcbI1SJgrpA637g2LNlPy9sQ7JirSLh4mp9mr6YXLmUVIF5GVF7uc8jf5UnQzJyj0Ftb7mIex9p_MMnS0WM3ENhLqapI0bJZ4x9q8WsgIZfZ6oXHYx';
      const response = await fetch(`https://api.yelp.com/v3/businesses/${restaurant.alias}`, {
        method: 'GET',
        headers: new Headers({
          'Authorization': `Bearer ${Token}`
        })
      });
      const parsedResponse = JSON.parse(response._bodyInit);
      this.setState({ restaurantObject: parsedResponse })
    } catch (error) {
      alert('An error occurred while fetching this business');
      this.props.navigation.goBack();
    }
  }

  convertToKM = (value) => {
    const valueInKM = (value / 1000).toFixed(1);
    return `${valueInKM} km`;
  }

  render() {
    const screenHeight = Dimensions.get('window').height;
    const { restaurantObject } = this.state;
    const { navigation } = this.props;
    const distance = navigation.getParam('distance');
    return (
      <View style={{ flex: 1, height: screenHeight }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
          <Image
            source={{ uri: restaurantObject.image_url }}
            style={{
              height: 250,
              width: '100%'
            }}
          />
          <View style={{
            position: 'absolute',
            top: 40,
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 15
              }}
            >
              <Ionicons
                name="ios-arrow-round-back"
                size={25}
                color='#FFF'
              />
            </TouchableOpacity>
            <Ionicons
              name='ios-heart-empty'
              size={20}
              style={{
                marginLeft: 'auto',
                marginRight: 20
              }}
              color='#FFF'
            />
          </View>
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 20,
          }}>
            <View style={{
              borderRadius: 50,
              overflow: 'hidden'
            }}>
              <Image
                style={{
                  height: 50,
                  width: 50
                }}
                source={{ uri: restaurantObject.photos && restaurantObject.photos[1] }}
              />
            </View>
            <View style={{
              display: 'flex',
              marginRight: 35
            }}>
              <Text style={{
                flex: 1,
                flexWrap: 'wrap',
                fontWeight: '600',
                marginTop: 5
              }}>{restaurantObject.name}</Text>
              <View style={{
                display: 'flex',
                position: 'absolute',
                flexDirection: 'row',
                top: 30
                }}>
                <Text style={{
                  fontSize: 12,
                  marginRight: 2,
                  color: '#FFA500'
                }}>{restaurantObject.rating && restaurantObject.rating.toFixed(1)}</Text>
                <Stars
                  count={5}
                  default={restaurantObject.rating}
                  half={true}
                  starSize={12}
                  fullStar={<Ionicons name='ios-star' style={{ color: '#FFA500', marginTop: 2 }} />}
                  halfStar={<Ionicons name='ios-star-half' style={{ color: '#FFA500', marginTop: 2 }} />}
                  emptyStar={<Ionicons name='ios-star-outline' style={{ color: '#FFA500', marginTop: 2 }} />}
                />
                <Text style={{
                  marginLeft: 10,
                  fontSize: 13,
                  fontWeight: '400',
                  color: '#A9A9A9'
                }}>{restaurantObject.categories && restaurantObject.categories[0].title}</Text>
              </View>
            </View>
            <View style={{
            }}>
              <Text style={{
                color: '#FFF',
                backgroundColor: '#FFA500',
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 2,
                paddingRight: 2,
                marginTop: 5
              }}>{this.convertToKM(distance)}</Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 20,
              opacity: .5
            }}
          />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FontAwesome
                name='phone'
                size={18}
                color='#808080'
              />
              <Text style={{
                marginTop: 5,
                color: '#808080'
              }}>Call</Text>
            </View>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons
                name='md-globe'
                size={18}
                color="#808080"
              />
              <Text style={{
                marginTop: 5,
                color: '#808080'
              }}>Website</Text>
            </View>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <MaterialIcons
                name='directions'
                size={18}
                color="#808080"
              />
              <Text style={{
                marginTop: 5,
                color: '#808080'
              }}>Directions</Text>
            </View>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons
                name='md-chatboxes'
                size={18}
                color='#808080'
              />
              <Text style={{
                marginTop: 5,
                color: '#808080'
              }}>Invite</Text>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 20,
              opacity: .5
            }}
          />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 15
          }}>
            <Image
              source={require('../assets/images/otable.jpg')}
              style={{
                height: 20,
                width: 20
              }}
            />
            <Text style={{
              marginTop: 2,
              marginLeft: 10,
              color: '#808080',
              fontWeight: '500'
            }}>Book a table with Opentable</Text>
            <Ionicons
              name='ios-arrow-forward'
              size={15}
              style={{
                marginLeft: 'auto',
                marginRight: 35,
                marginTop: 4
              }}
              color='#808080'
            />
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              opacity: .5
            }}
          />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 15
          }}>
            <Image
              source={require('../assets/images/uber.png')}
              style={{
                height: 20,
                width: 20
              }}
            />
            <Text style={{
              marginTop: 2,
              marginLeft: 10,
              color: '#808080',
              fontWeight: '500'
            }}>Book a ride with Uber</Text>
            <Ionicons
              name='ios-arrow-forward'
              size={15}
              style={{
                marginLeft: 'auto',
                marginRight: 35,
                marginTop: 4
              }}
              color='#808080'
            />
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              opacity: .5
            }}
          />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 15
          }}>
            <Feather
              name='clock'
              size={20}
              color='#808080'
            />
            <Text style={{
              marginTop: 2,
              marginLeft: 10,
              color: '#808080',
              fontWeight: '500'
            }}>Open Now (07-24h)</Text>
            <Ionicons
              name='ios-arrow-forward'
              size={15}
              style={{
                marginLeft: 'auto',
                marginRight: 35,
                marginTop: 4
              }}
              color='#808080'
            />
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              opacity: .5,
            }}
          />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: 30,
            marginTop: 15
          }}>
            <Image
              source={require('../assets/images/study.png')}
              style={{
                height: 20,
                width: 20
              }}
            />
            <Text style={{
              marginTop: 2,
              marginLeft: 10,
              color: '#808080',
              fontWeight: '500'
            }}>Menu</Text>
            <Feather
              name='link-2'
              size={20}
              style={{
                marginLeft: 'auto',
                marginRight: 35,
                marginTop: 4
              }}
              color='#808080'
            />
          </View>
          <View
            style={{
              borderBottomColor: '#DCDCDC',
              borderBottomWidth: 1,
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              opacity: .5,
              marginBottom: 20
            }}
          />
          <View style={{
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 5,
            overflow: 'hidden'
          }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          </View>
          
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#FFF',
            paddingBottom: 30,
            paddingTop: 15,
            display: 'flex',
            width: '100%',
            ...Platform.select({
              ios: {
                shadowOffset: { width: 0, height: 1 },
                shadowColor: 'gray',
                shadowOpacity: 0.7,
              },
              android: {
                borderTopWidth: 1,
                borderTopColor: '#808080',
                elevation: 3
              }
            })
          }}>
            <Text style={{
              color: '#FFA500',
              textAlign: 'center'
            }}>VIEW OFFERS</Text>
        </View>
      </View>
    )
  }
}

export default BusinessDetails
