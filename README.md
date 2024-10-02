<h1 style="text-align: center">Мобильное приложение AKVILON</h1>

<h2 style="text-align: center">Ссылки</h2>

[Ноушен](https://www.notion.so/panfilovdigital/379d3739bff749ab9aa307860f627551)\
[Документация Кода](https://github.com/quetzal19/akvilon-mobile/wiki/Exports)

---
<h2 style="text-align: center">Технический онбординг</h2>

<h3 style="text-align: center">Список библиотек</h3>

[react-native](https://reactnative.dev/)\
[react-navigation](https://reactnavigation.org/)\
[react-native-papper](https://reactnativepaper.com/)\
[react-native-webview](https://github.com/react-native-webview/react-native-webview/tree/master/docs)\
[redux](https://redux.js.org/)\
[react-redux](https://react-redux.js.org/)\
[redux-toolkit](https://redux-toolkit.js.org/)\
[redux-thunk](https://www.npmjs.com/package/redux-thunk)\
[react-native-firebase](https://rnfirebase.io/)\
[@kichiyaki/react-native-barcode-generator](https://github.com/Kichiyaki/react-native-barcode-generator)\
[react-native-appmetrica](https://www.npmjs.com/package/react-native-appmetrica)\
[react-native-device-info](https://github.com/react-native-device-info/react-native-device-info)\
[react-native-image-filter-kit](https://www.npmjs.com/package/react-native-image-filter-kit)\
[react-native-insta-story](https://www.npmjs.com/package/react-native-insta-story)\
[react-native-linear-gradient](https://www.npmjs.com/package/react-native-linear-gradient)\
[react-native-qrcode-svg](https://www.npmjs.com/package/react-native-qrcode-svg)\
[react-native-torch](https://www.npmjs.com/package/react-native-torch)\


<h3 style="text-align: center">Основна</h3>

Для построение и разработки проекта используется [React-native](https://reactnative.dev/). 

<h3 style="text-align: center">Навигация</h3>

Для внутренней навигации используется [React-navigation](https://reactnavigation.org/)
В папке `/src/screens/*` - Находятся все экраны
Структура:\
*src\
|\
|- error - Сттраница ошибки вызывается в App.tsx\
|----- index.tsx\
|- home - Основной скрин вызывается в App.tsx\
|--- cart - Навигация страницы\
|----- index.tsx\
|--- catalog - Навигация катаога\
|----- index.tsx\
|--- home - Навигация - Главной\
|----- index.tsx\
|--- settings - Навигация настроек\
|----- bonus - Навигация с бонусами.\
|------- index.tsx\
|----- city - Навигация с выбором города.\
|------- index.tsx\
|----- profile - Навигация с детальными страницах проффиля\
|------- sign - Навигация Авторизации\
|--------- msg - Навигация получения СМС\
|----------- index.tsx\
|--------- signin - Навигация Авторизации\
|----------- index.tsx\
|--------- signup Навигация Регистрации\
|----------- index.tsx\
|--------- index.tsx\
|------- index.tsx\
|----- index.tsx\
|--- webview - Основной компонент Webview\
|----- index.tsx\
|--- index.tsx\
|- EmptyScreen.tsx\

Выходя из структуры можем понять пару правил:
1. Все экраны имеют название index.tsx;
2. Если должны быть сильные различия на страницах, то используем расширение index.android.tsx | index.ios.tsx;
3. Все экраны лежат в отдельных папках;
4. Структура дублирует роутинг внутри приложения.

<h3 style="text-align: center">Компоненты</h3>

В данный момент используются компоненты из библиотеки react-native-paper. 
Есть самописные компоненты.

Компоненты на главной странице:
1. CustomLoader
2. FlatList (Обёртка для главной страницы)
3. CityHeader (Компонент с выбранным городом)
4. Searchinput (Компонент с будущей доработкой по поиску на главной)
5. Stories (Сторисы на главной)
6. BonusCard (Компонент бонусной карты)
7. CallComponent (Компонент заказа звонка для покупки или заказа)
8. SliderImage (Слайдер с картинками из админки)
9. PopularCategory (Компонент популярных категорий, 3х3 таблица)
10. Slider (Содержит в себе списки товаров для категорий: "Новинки", "Распродажа")
11. SliderBanner (Слайдер с баннерами из админки)
12. Brands (Компонент со списком брендов)
13. HelpFind (Компонент с чипсами для быстрой навигации в каталог)
14. Support (Компонент тех. поддержки)
15. MakeCallDrawer (Компонент заказа звонка)

<h3 style="text-align: center">Замена иконок в приложении.</h3>
Будут отличия для Android и iOS.

Для андройд необходимо пойти в папку /android/app/src/main/res
В ней мы увидим список папок с названием drawable 
В каждую из них необоходимо поместить наше изображение с иконкой в формате png, и названием
ic_launcher_round
Далее просто пересобрать приложение

Для iOS путь будем другим: /ios/akvilonmobile/Images.xcassets/AppIcon.appiconset
В этой папке мы увидим список изображений с различными размерами. 
Нам необходимо их заменить на новые, не изменяя их имени. Также в формате png.

<h3 style="text-align: center">Версионность</h3>

При добавлении функционала на фронт, который требует версии, прописываем проверку "if", и добавляем туда versionChecker('mobileVersionNumber', 'версия от которой должен быть виден функционал').

Из мобилки версия отправляется при помощи куков. В старых версиях приложения - при помощи параметров url.

Также с помощью куков передаётся версия мобильной системы и сама мобильная система (Android, iOS)

<h3 style="text-align: center">Деплой</h3>

1. В файле app.json - меняем версию. 
2. В файле `${PROJECT_FOLDER}/android/app/build.gradle` - меняем версию, на такую же как в app.json
3. В файле `${PROJECT_FOLDER}/android/app/build.gradle` - меняем версию билда, +1;
4. Выключаем все открытые окна связанные с React-Native. Console | Metro Server | etc. 
6. Для сборки АPK пишем - npm run test-build. Находится в папке android app build outputs apk release.
7. Проверяем, чтобы APK версия, нормально работала на вашем устройстве
8. Для сборки релиза aab пишем - npm run release-build.
9. Далее выгружаем в сторы гугла и эпла. 
