//Plik konfiguracyjny - opis wartości zmiennych process.env. 
//znajdują się jedynie w konfiguracji platformy hostingowej Heroku

//Sekret JWT służący do weryfikacji i podpisywania tokenów JWT
process.env.JWT_SECRET;

//token połączenia z bazą MongoDB
process.env.MongooseURI;

//PORT na którym ma zostać utworzony serwer
process.env.PORT

//nazwa konta gmail
process.env.MAIL_USERNAME

//hasło do konta gmail
process.env.MAIL_PASSWORD

//CLIENTID OAuth - konfiguracja API Gmail
process.env.OAUTH_CLIENTID

//CLIENT_SECRET OAuth - konfiguracja API Gmail
process.env.OAUTH_CLIENT_SECRET

//CLIENT_REFRESH_TOKEN OAuth - konfiguracja API Gmail
process.env.OAUTH_REFRESH_TOKEN