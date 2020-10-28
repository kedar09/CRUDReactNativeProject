import React, {Component} from 'react';
import {View, ScrollView, LogBox} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import {DataTable, HelperText, TextInput, Button, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import {getAllUser, deleteUserData, addUpdateUserData} from '../../../services/Home/HomePage.service';
import styles from './home-page.css';

class HomePage extends Component {
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
        getAllUser()
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
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
                        <Button style={styles.tableEditUserButton}
                                onPress={index => this.selectData(userInfoId, name, address, mobileNumber)}>
                            <Icon name="edit" size={20}/>
                        </Button>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Button style={styles.tableDeleteUserButton}
                                onPress={index => deleteUserData(userInfoId).then(() => {
                                    this.refreshState();
                                })}>
                            <Icon name="delete" size={20}/>
                        </Button>
                    </DataTable.Cell>
                </DataTable.Row>
            );
        });
    }

    selectData(userInfoId, name, address, mobileNumber) {
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
            <View style={styles.container}>
                <ScrollView>
                    <Card>
                        <Card.Title
                            title="User Information"/>
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

                                    addUpdateUserData(userData, getPath).then(() => {
                                            this.refreshState();
                                        },
                                    );
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
                                            />
                                            <HelperText type="error"
                                                        visible={touched.mobileNumber && errors.mobileNumber ? true : false}>
                                                {errors.mobileNumber}
                                            </HelperText>
                                        </View>

                                        <Button onPress={handleSubmit} color='#3333ff' mode="contained">Save</Button>
                                        <Button style={styles.cancelButton} color='#737373'
                                                onPress={() => this.refreshState()} mode="contained">Cancel</Button>

                                    </View>
                                )}
                            </Formik>
                        </Card.Content>
                    </Card>
                    
                    <Card style={styles.tableCard}>
                        <Card.Title
                            title="Users Details"/>
                        <Card.Content>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Title numeric>Mobile Number</DataTable.Title>
                                    <DataTable.Title numeric>Edit</DataTable.Title>
                                    <DataTable.Title numeric>Delete</DataTable.Title>
                                </DataTable.Header>
                                {this.tableData()}
                            </DataTable>
                        </Card.Content>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

export default HomePage;
