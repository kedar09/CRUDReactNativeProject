import {API_URL} from '../../config/dev.config';
import {Alert} from 'react-native';

export const getAllUser = () => {
    return fetch(  `${API_URL}/users/getAllUser`)
        .then(res =>  res);
}

export const deleteUserData = (userInfoId) => {
    return fetch(`${API_URL}/users/deleteUserById/${userInfoId}`, {
        method: 'DELETE',
    }).then((response) => response.json())
        .then((responseJson) => {
            Alert.alert(responseJson.message);
        }).catch((error) => {
            console.error(error);
        });
}

export const addUpdateUserData = (userData, getPath) => {
    return fetch(`${API_URL}/users/${getPath}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    }).then((response) => response.json())
        .then((responseJson) => {
            Alert.alert(responseJson.message);
        }).catch((error) => {
        console.error(error);
    });
}
