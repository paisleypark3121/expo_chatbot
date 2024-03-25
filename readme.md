npx create-expo-app ChatBot
cd ChatBot
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo start

---

ICONS

npm i react-native-vector-icons --save

---

SNIPPET

rfc React Functional Component

---

DRAWER NAVIGATOR

npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/drawer
npx expo install react-native-gesture-handler react-native-reanimated

To finalize installation of react-native-gesture-handler, add the following at the top (make sure it's at the top and there's nothing else before it) of your entry file, such as index.js or App.js:
import 'react-native-gesture-handler';

---

ASYNC STORAGE

npm install @react-native-async-storage/async-storage

---

EXPO PUBLISH
Create a new build: eas build
List all branches: eas branch:list
Create a new branch: eas branch:create <branch-name>
Delete a branch: eas branch:delete <branch-name>
Update a branch: eas update --branch <branch-name> (or simply eas update and later you will be asked to choose the branch)
