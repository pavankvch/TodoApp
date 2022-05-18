import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,StatusBar
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {deleteTodo, getAllTodos, promiseHandler} from '../api/ApiService';
import {FloatingAction} from 'react-native-floating-action';
import Toast from 'react-native-toast-message';
import {Dropdown} from 'react-native-element-dropdown';
import CustomAlertComponent from './CustomAlertComponent';
import { SwipeListView } from 'react-native-swipe-list-view';

const TodoList = ({navigation}) => {
  const [todoData, setTodoData] = useState([]);
  const [visible, setVisible] = React.useState(true);
  const [value, setValue] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const [data, error] = await promiseHandler(getAllTodos());
    if (data) {
      // console.log("response getTodos" + JSON.stringify(data));
      setTodoData(data);
    } else {
      console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
    }
  }

  async function deleteTodoClick(todoId) {
    const [data, error] = await promiseHandler(deleteTodo(todoId));
    if (data) {
      // console.log("response getTodos" + JSON.stringify(data));
      // setTodoData(data)
    } else {
      console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
    }

    
  }

  const TodoItem = ({item, index}) => {
    return (
      <View style={styles.container2}>
        <View style={styles.columnContainer}>
        {item.completed == true ?
           <Text style={styles.strikeThroughtextStyle}>{item.title}</Text> :  
           <Text style={styles.labelBlack} >{item.title}</Text>}
          <TouchableOpacity
            onPress={() => {
              deleteTodoClick(item.id);
            }}>
            <Image
              source={require('../assets/deleteicon.png')}
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditTodo', {
                title: item.title,
                userId: item.userId,
              });
            }}>
            <Image
              source={require('../assets/editicon.png')}
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({item}) => <TodoItem item={item} />;
  const data = [
    {label: 'All', value: '1'},
    {label: 'Complete', value: '2'},
    {label: 'InComplete', value: '3'},
  ];

  const sortAction = value => {
    console.log('sortAction===>' + value);
    setValue(value);
  };

  const listFilter = item => {
    if (value == 1) {
      return true;
    } else if (value == 2) {
      // if(item.completed == true){
      //     console.log("completed===>"+value)
      // }

      return item.completed == true;
    } else if (value == 3) {
      // if(item.completed == false){
      //     console.log("incomplete===>"+value)
      // }

      return item.completed == false;
    }

    return true;
  };

  return (
      
    <View style={styles.container}>
        <StatusBar
        animated={true}
        backgroundColor="#61dafb"/>
      <Dropdown
        style={[styles.dropdown, true && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={'Select item'}
        value={value}
        onChange={item => {
          sortAction(item.value);
        }}
      />
      {todoData && (
        <FlatList
          data={todoData.filter(listFilter)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}

      <View style={styles.container}>
        <FloatingAction
          position="right"
          onPressMain={() => {
            navigation.navigate('AddTodo');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container2: {
    flex: 1,
    margin: 16,
  },
  columnContainer: {
    flexDirection: 'row',
  },
  labelBlack: {
    flex: 1,
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Roboto'
  },
  dropdown: {
    height: 50,
    width: 150,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    margin: 10,
    alignSelf: 'flex-end',
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
  },
  placeholderStyle: {
    fontSize: 14,
    //	backgroundColor:"green"
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  strikeThroughtextStyle: {
    textDecorationLine: 'line-through',
    flex: 1,
    fontSize: 14,
    fontFamily: 'Roboto'
  },
});

export default TodoList;
