import React, {Component} from 'react';
import {View, Alert, ScrollView, LogBox} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
// import { Input, Button } from 'react-native-elements';
import {DataTable, HelperText, TextInput, Button, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';

// const baseUrl = "http://172.17.0.1:3001/";

class HomeScreenPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfoId: '',
            name: '',
            address: '',
            mobileNumber: '',
            isLoading: true,
            dataSource: [],
        };
    }

    componentDidMount() {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

        return fetch('http://172.17.0.1:3001/users/getAllUser')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    tableData() {
        return this.state.dataSource.map((res, index) => {
            const {userInfoId, name, address, mobileNumber} = res; //destructuring
            return (
                <DataTable.Row key={index}>
                    <DataTable.Cell>{name}</DataTable.Cell>
                    <DataTable.Cell numeric>{mobileNumber}</DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Button style={{marginRight: 20, alignItems: 'center', justifyContent: 'center'}}
                                onPress={index => this.selectData(userInfoId, name, address, mobileNumber)}>
                            <Icon name="edit" size={20}/>
                        </Button>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Button style={{alignItems: 'center', justifyContent: 'center'}}
                                onPress={index => this.deleteData(userInfoId)}>
                            <Icon name="delete" size={20}/>
                        </Button>
                    </DataTable.Cell>
                </DataTable.Row>
            );
        });
    }

    deleteData(userInfoId) {
        return fetch(`http://172.17.0.1:3001/users/deleteUserById/${userInfoId}`, {
            method: 'DELETE',
        }).then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(responseJson.message);
                this.refreshState();
            }).catch((error) => {
                console.error(error);
            });
    }

    selectData(userInfoId, name, address, mobileNumber) {
        console.log(userInfoId, name, address, mobileNumber);
        this.setState({
            userInfoId: userInfoId,
            name: name,
            address: address,
            mobileNumber: mobileNumber.toString(),
        });
    }

    refreshState() {
        this.setState({
            userInfoId: '',
            name: '',
            address: '',
            mobileNumber: '',
        });
        this.componentDidMount();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'stretch',
                padding: 20,
            }}>
                <ScrollView>
                    <Card>
                        <Card.Title
                            title="User Information" />
                        <Card.Content>
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state}
                                onSubmit={values => {
                                    let getPath = this.state.userInfoId === '' ? 'addUser' : 'updateUser';
                                    let userData = this.state.userInfoId === '' ? {
                                        name: values.name,
                                        address: values.address,
                                        mobileNumber: values.mobileNumber,
                                    } : {
                                        userInfoId: values.userInfoId,
                                        name: values.name,
                                        address: values.address,
                                        mobileNumber: values.mobileNumber,
                                    };
                                    fetch(`http://172.17.0.1:3001/users/${getPath}`, {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(userData),
                                    }).then((response) => response.json())
                                        .then((responseJson) => {
                                            Alert.alert(responseJson.message);
                                            // console.log(responseJson)
                                            this.refreshState();
                                        }).catch((error) => {
                                        console.error(error);
                                    });

                                }}
                                validationSchema={yup.object().shape({
                                    name: yup
                                        .string()
                                        .required(),
                                    address: yup
                                        .string()
                                        .required(),
                                    mobileNumber: yup.number()
                                        .required(),
                                })}
                            >
                                {({handleChange, handleBlur, touched, errors, handleSubmit, values}) => (
                                    <View>
                                        <View>
                                            <TextInput
                                                label="Name"
                                                onChangeText={handleChange('name')}
                                                onBlur={handleBlur('name')}
                                                value={values.name}
                                                mode='outlined'
                                                error={touched.name && errors.name ? true : false}
                                                // errorMessage={touched.name && errors.name ? errors.name : ''}
                                            />
                                            <HelperText type="error"
                                                        visible={touched.name && errors.name ? true : false}>
                                                {errors.name}
                                            </HelperText>
                                        </View>

                                        <View>
                                            <TextInput
                                                label="Address"
                                                onChangeText={handleChange('address')}
                                                onBlur={handleBlur('address')}
                                                mode='outlined'
                                                value={values.address}
                                                error={touched.address && errors.address ? true : false}
                                                // errorMessage={touched.address && errors.address ? errors.address : ''}
                                            />
                                            <HelperText type="error"
                                                        visible={touched.address && errors.address ? true : false}>
                                                {errors.address}
                                            </HelperText>
                                        </View>

                                        <View>
                                            <TextInput
                                                label="Mobile Number"
                                                onChangeText={handleChange('mobileNumber')}
                                                onBlur={handleBlur('mobileNumber')}
                                                mode='outlined'
                                                value={values.mobileNumber}
                                                error={touched.mobileNumber && errors.mobileNumber ? true : false}
                                                keyboardType={'numeric'}
                                                // errorMessage={touched.mobileNumber && errors.mobileNumber ? errors.mobileNumber : ''}
                                            />
                                            <HelperText type="error"
                                                        visible={touched.mobileNumber && errors.mobileNumber ? true : false}>
                                                {errors.mobileNumber}
                                            </HelperText>
                                        </View>

                                        <Button onPress={handleSubmit} color='#3333ff' mode="contained">Save</Button>
                                        <Button style={{marginTop: 10}} color='#737373' onPress={()=>this.refreshState()} mode="contained">Cancel</Button>

                                    </View>
                                )}
                            </Formik>
                        </Card.Content>
                    </Card>
                    <Card style={{marginTop: 10}}>
                        <Card.Title
                            title="Users Details" />
                        <Card.Content>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Title numeric>Mobile Number</DataTable.Title>
                                    <DataTable.Title numeric>Edit</DataTable.Title>
                                    <DataTable.Title numeric>Delete</DataTable.Title>
                                </DataTable.Header>

                                {this.tableData()}

                                {/*<DataTable.Pagination
                                    page={1}
                                    numberOfPages={3}
                                    onPageChange={page => {
                                        console.log(page);
                                    }}
                                    label="1-2 of 6"
                                />*/}
                            </DataTable>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

export default HomeScreenPage;
