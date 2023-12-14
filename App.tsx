import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';

import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({ children, title }: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>

      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

type ToDoViewProps = {
  todo: ToDo
}

const ToDoView = ({ todo }: ToDoViewProps) => {
  return (
    <View elevation={5} style={styles.card}>
      <Text>{todo.title}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <UserNameLabel name={todo.userName}/>
        <CompleteIndicator completed={todo.completed}/>
      </View>
    </View>
  );
}

const UserNameLabel = ({ name }: String) => {
  // I decided to still show the rest of the todo and simply note that the user name is missing
  // instead of not showing the todo.
  if (name == null) return <Text style={{fontStyle: "italic"}}>user name missing</Text>

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={require('./assets/user_icon.png')}/>
      <Text style={{fontStyle: "italic"}}> {name} </Text>
    </View>
  );
}

const CompleteIndicator = ({ completed }: Boolean) => {
  const icon = completed ? require('./assets/complete_icon.png')
      : require('./assets/uncomplete_icon.png');

  const text = completed ? 'Complete' : 'Uncomplete';

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={icon}/>
      <Text style={{fontStyle: "italic"}}> {text} </Text>
    </View>
  );
}

/**
{@link ToDo.userName} can be null
*/
type ToDo = {
  id: number;
  userId: number;
  userName: String;
  title: String;
  completed: Boolean;
}

// Only those fields are needed for the tasks, the others can be ignored.
// If this type could be used in the future, I would add all the fields.
type Users = {
  id: number;
  name: String;
}

enum FilterMode {
  All,
  Completed,
  Uncompleted
}

const ToDos = () => {
  const [filterMode, setFilterMode] = useState(FilterMode.All);

  const { isLoading: usersAreLoading, error: usersError, data: usersData } = useQuery({
    queryKey: ['users'],

    queryFn: (): Promise<User[]> =>
      fetch('https://jsonplaceholder.typicode.com/users').then(
        (res) => res.json(),
      ),
  });

  const { isLoading: todosAreLoading, error: todosError, data: todosData } = useQuery({
    queryKey: ['todos'],

    queryFn: (): Promise<ToDo[]> =>
      fetch('https://jsonplaceholder.typicode.com/todos').then(
        (res) => res.json(),
      ),
  });

  if (todosAreLoading || usersAreLoading) return <Text>Loading...</Text>

  if (todosError) return <Text>An error has occurred ${todosError.message}</Text>

  if (!todosData) return <Text>Data was undefined :(</Text>

  const filteredToDos = filterToDos(todosData, filterMode);

  if (usersData != null) mapUserNamesToToDos(todosData, usersData);

  return (
    <View style={{flexDirection: "column", gap: 10}}>
      {todosData.map((todo: ToDo) => (<ToDoView todo={todo} />))}
    </View>
  );
}

function filterToDos(todos: ToDo[], filterMode: FilterMode): ToDo[] {
  if (filterMode === FilterMode.All) return todos;

  if (filterMode === FilterMode.Completed) return todos.filter((todo) => todo.completed);

  if (filterMode === FilterMode.Uncompleted) return todos.filter((todo) => !todo.completed);
}

/**
This function will set the matching user names in the given {@link ToDo} object.
*/
function mapUserNamesToToDos(todos: ToDo[], users: User[]): void {
  // I will simply loop over the users for every todo.
  // This would cause performance issues if the users list gets too long.
  // But for this task it suffices.

  for (var todo of todos) {
    const userId = todo.userId;

    if (userId != null) {
      for (var user of users) {
        if (userId == user.id) {
          todo.userName = user.name;
        }
      }
    }
  }
}

const queryClient = new QueryClient()

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <View
            style={{
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}>
            <Section title="ToDos">
              <ToDos />
            </Section>
          </View>
        </ScrollView>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  card: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "white",
    shadowOpacity: 0.3,
    shadowColor: "black",
    shadowRadius: 10,
    maxWidth: 0.9 * Dimensions.get('window').width,
  },
});

export default App;
