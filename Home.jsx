import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Button, Card } from 'react-native-paper';

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [minPrice, setMinPrice] = useState('0');
    const [maxPrice, setMaxPrice] = useState('1000000000');
    const [propertyType, setPropertyType] = useState('');
    const [filteredProperties, setFilteredProperties] = useState([]);

    const fetchProperties = async () => {
        if (loading || isEnd) return;
        setLoading(true);

        try {
            const response = await axios.get('https://api.rehabloop.com/property/get-nearby-property', {
                params: {
                    page: page,
                    pageSize: 10
                }
            });
            const data = response.data.properties.properties;

            if (data.length === 0) {
                setIsEnd(true);
            } else {
                setProperties(prevProperties => [...prevProperties, ...data]);
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!isEnd) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [page]);

    useEffect(() => {
        // Filter properties based on the current search text, price range, and property type
        const filtered = properties.filter(property => {
            const matchesSearch = property.propertyName.toLowerCase().includes(searchText.toLowerCase()) ||
                property.address.toLowerCase().includes(searchText.toLowerCase());

            const matchesPrice = (
                (minPrice ? property.price_in >= parseFloat(minPrice) : true) &&
                (maxPrice ? property.price_in <= parseFloat(maxPrice) : true)
            );

            const matchesType = property.select_Category.toLowerCase().includes(propertyType.toLowerCase());

            return matchesSearch && matchesPrice && matchesType;
        });
        setFilteredProperties(filtered);
    }, [searchText, minPrice, maxPrice, propertyType, properties]);

    const renderItem = ({ item }) => {
        const imageUrl = JSON.parse(item.images)[0];

        return (
            <Card style={styles.card}>
                <Card.Cover source={{ uri: imageUrl }} />
                <Card.Content>
                    <Text style={styles.propertyTitle}>{item.propertyName}</Text>
                    <Text style={styles.price}>${item.price_in}</Text>
                    <Text style={styles.location}>{item.address}</Text>
                </Card.Content>
            </Card>
        );
    };

    const renderheader = () => {
        return (
            <View>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search by name or location"
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <View style={styles.filtersContainer}>
                    {/* Price Range */}
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Min Price:</Text>
                        <TextInput
                            style={styles.priceInput}
                            keyboardType="numeric"
                            value={minPrice}
                            onChangeText={setMinPrice}
                            placeholder="Min"
                        />
                    </View>

                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Max Price:</Text>
                        <TextInput
                            style={styles.priceInput}
                            keyboardType="numeric"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                            placeholder="Max"
                        />
                    </View>

                    {/* Property Type */}
                    <View style={styles.filterRow}>
                        <Text style={styles.filterLabel}>Property Type:</Text>
                        <TextInput
                            style={styles.propertyTypeInput}
                            value={propertyType}
                            onChangeText={setPropertyType}
                            placeholder="e.g., House, Apartment"
                        />
                    </View>

                    {/* Clear Filters Button */}
                    <Button mode="contained" onPress={clearFilters} style={styles.clearButton}>
                        Clear Filters
                    </Button>
                </View>
            </View>
        )
    }
    const renderEmpty= () => {
        return (
            <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No properties found. Try adjusting your filters or search.</Text>
            </View>
        );
    };

    const clearFilters = () => {
        setSearchText('');
        setMinPrice('');
        setMaxPrice('');
        setPropertyType('');
    };

    return (
        <View style={styles.container}>


            {/* Properties List */}
            {loading && !filteredProperties.length ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={filteredProperties}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={renderheader}
                        ListEmptyComponent={renderEmpty}
                    ListFooterComponent={
                        loading && !isEnd ? <ActivityIndicator size="small" color="#0000ff" /> : null
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    filtersContainer: {
        marginBottom: 20,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    priceInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '40%',
        paddingLeft: 10,
    },
    propertyTypeInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '60%',
        paddingLeft: 10,
    },
    clearButton: {
        marginTop: 20,
        backgroundColor: '#e91e63',
    },
    card: {
        marginBottom: 15,
        borderRadius: 12,
        elevation: 5,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
    },
    propertyTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e91e63',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: '#777',
    },
});

export default Home;
