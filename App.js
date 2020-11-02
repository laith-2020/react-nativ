import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Text, View, Button, Linking, TouchableOpacity } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import { enableScreens } from 'react-native-screens';
import { Camera } from 'expo-camera';

export default function App() {
  enableScreens();

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [contacts, setContacts] = useState([]);
  const [permissions, setPermissions] = useState(false);

  const getPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);
    setPermissions(true);
  }


  const showContacts = async () => {
    const contactList = await Contacts.getContactsAsync();
    setContacts(contactList.data);
  }

  useEffect(() => {
    getPermissions();
  }, [])


  const call = contact => {
    let phoneNumber = contact.phoneNumber[0].number.replace(/[\(\)\-\s+]/g, '')
    console.log(contact);
    let link = `tel:${phoneNumber}`;
    Linking.canOpenURL(link).then(supported => Linking.openURL(link)).catch(console.error)
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
      <Text>hello laith!</Text>
      <Button
        onPress={showContacts}
        title="show Contacts"
      />
     
      <StatusBar style="auto" />

      <View style={styles.section}>
        <Text>Data ..</Text>
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Button style={styles.person} title={item.name} onPress={() => call(item)} />}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    </View>

  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  person: {
    marginTop: '1em',
  },
  section: {
    margin: 10,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

