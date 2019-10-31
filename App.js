import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
  TextInput,
  FlatList,
  Alert,
  AsyncStorage,
} from 'react-native';
import {
  
  createAppContainer,
  StackActions,
  NavigationActions,
} from 'react-navigation';
import {
  createStackNavigator,
  
  
} from 'react-navigation-stack';

//A stylesheet
const styles = StyleSheet.create({
  mainview: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },

  notesview: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 10,
  },

  addview: {
    backgroundColor: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 10,
  },
});

let noteArray = [];

class NoteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      notes: [],
    };
  }

  static navigationOptions = {
    title: 'Notes',
  };

  HandleButtonPress = () => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Adding' })],
    });

    this.props.navigation.dispatch(resetAction);
  };

  componentDidMount = async () => {
    const notes = await this.getNotes();
    this.setState({ notes: notes });
  };

  getNotes = async () => {
    let notes = [];
    try {
      notes = await AsyncStorage.getItem('notes');
      if (!notes) {
        notes = [];
      }
    } catch (error) {
      console.error(error);
    }

    return JSON.parse(notes);
  };

  ListItems = () => {
    return this.state.notes.map(data => {
      return <Text> {data} </Text>;
    });
  };

  render() {
    return (
      <View style={styles.mainview}>
        <ScrollView style={styles.notesview}>{this.ListItems()}</ScrollView>
        <View style={styles.addview}>
          <Button title="ADD NOTE" onPress={this.HandleButtonPress} />
        </View>
      </View>
    );
  }
}

class AddScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      notes: [],
    };
  }

  componentDidMount = async () => {
    const notes = await this.getNotes();
    this.setState({ notes: notes });
  };

  getNotes = async () => {
    let notes = [];
    try {
      notes = await AsyncStorage.getItem('notes');
      if (!notes) {
        notes = [];
      }
    } catch (error) {
      console.error(error);
    }

    return JSON.parse(notes);
  };

  setNotes = async notes => {
    this.setState({ notes: notes });

    try {
      notes = await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error(error);
    }
  };

  addNote = async note => {
    if (this.state.notes.includes(note)) {
      Alert.alert(
        'Note already exists',
        'The note exists already!',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      const notes = this.state.notes.concat(note);
      await this.setNotes(notes);
    }
  };

  HandleButtonPress = () => {
    noteArray.push(this.state.note);
    this.addNote(this.state.note);

    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Notes' })],
    });

    this.props.navigation.dispatch(resetAction);
  };

  static navigationOptions = {
    title: 'Adding',
  };

  render() {
    return (
      <View style={styles.mainview}>
        <View style={styles.addview}>
          <TextInput
            placeholder="Write the note here"
            onChangeText={note => this.setState({ note: note })}
          />
          <Button title="ADD NOTE" onPress={this.HandleButtonPress} />
        </View>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Notes: { screen: NoteScreen },
    Adding: { screen: AddScreen },
  },
  {
    initialRouteName: 'Notes',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
