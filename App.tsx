import React from 'react';
import type {PropsWithChildren} from 'react';

import {
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
    <View style={{padding: 5, borderRadius: 5, backgroundColor: "white", shadowOpacity: 0.3, shadowColor: "black", shadowRadius: 10, width: "100%"}}>
      <Text>{todo.title}</Text>
      <Text style={{fontStyle: "italic"}}>by User {todo.userId}</Text>
    </View>
  );
}

type ToDo = {
  id: number;
  userId: number;
  title: String;
  completed: Boolean;
}

const ToDos = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['todos'],

    queryFn: (): Promise<ToDo[]> =>
      fetch('https://jsonplaceholder.typicode.com/todos').then(
        (res) => res.json(),
      ),
  });

  if (isLoading) return <Text>Loading...</Text>

  if (error) return <Text>An error has occurred ${error.message}</Text>

  if (!data) return <Text>Data was undefined :(</Text>

  return (
    <View style={{flexDirection: "column",  flex: 1, gap: 10 }}>
      {data.map((todo: ToDo) => (<ToDoView todo={todo} />))}
    </View>
  );
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
});

export default App;
