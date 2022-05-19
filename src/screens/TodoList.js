import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,StatusBar, TouchableHighlight, Alert
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {editTodo, deleteTodo, getAllTodos, promiseHandler} from '../api/ApiService';
import {FloatingAction} from 'react-native-floating-action';
import {Dropdown} from 'react-native-element-dropdown';
import { SwipeListView } from 'react-native-swipe-list-view';
import Toast from 'react-native-simple-toast';

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
      Toast.show("Task Deleted Successfully");
      // console.log("response getTodos" + JSON.stringify(data));
      // setTodoData(data)
    } else {
      console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
    }

    
  }

  const showCompleteTaskAlert = (item) =>
    Alert.alert(
      "Complete Task",
      "Are you sure want to complete task",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => completeTodoItemClick(item.id, item.title)}
      ]
    );

  const TodoItem = ({item, index}) => {
    return (
      <TouchableHighlight
            onPress={() => showCompleteTaskAlert(item)}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
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
                id: item.id,
              });
            }}>
            <Image
              source={require('../assets/editicon.png')}
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableHighlight>
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

  const swipeRow = (rowMap, item) => {
   

    completeTodoItemClick(item.id, item.title)


};

async function completeTodoItemClick(todoId, todoTitle) {
  const json = {
      title: todoTitle,
      userId: 1,
      completed: true
  };

  const [data, error] = await promiseHandler(editTodo(todoId, json));

  if (data) {
    Toast.show('Task completed');
    console.log("json ==>" + JSON.stringify(json));
  } else {
      console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
  }
}
  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
        <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => swipeRow(rowMap, data.item)}
        >
            <Text style={styles.backTextWhite}>Completed</Text>
        </TouchableOpacity>
    </View>
);

const onRowDidOpen = rowKey => {
  console.log('This row opened', rowKey);
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
        // <FlatList
        //   data={todoData.filter(listFilter)}
        //   renderItem={renderItem}
        //   keyExtractor={item => item.id}
        // />

        <SwipeListView
        data={todoData.filter(listFilter)}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-80}
        previewOpenValue={-30}
        previewOpenDelay={2000}
        onRowDidOpen={onRowDidOpen}
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
  rowFront: {
    backgroundColor: '#FFFFFF',
    height: 50,
},
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
},
backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 80,
},
backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
},
backRightBtnRight: {
    backgroundColor: 'green',
    right: 0,
},
backTextWhite: {
  color: '#FFF',
}
});

export default TodoList;
