# IOI-ALUO-OCE-SIN
Online page: http://www.klement.tk/aluo/
Admin dostop: http://www.klement.tk/aluo/admin
	User: aluo
	Pass: adminaluo113

Za delovanje strani je potrebno: Apache, MySQL in PHP

Navodila za postavitev strani:
-v datoteki conf.php na vrhu spremenite podatke za dostop do MySQL baze ($host, $dbname, $username, $password)
-preko brskalnika poženite datoteko createDB.php, tako se ustvari ustrezna struktura baze in vnesejo konfiguracijski podatki
-v datoteko createDB.php na vrhu datoteke spremenite atribut $active iz true na false. Nov zapis bo tako $active = false;
-celotno mapo admin je potrebno ustrezno zakleniti s htaccess. V kodi je osnovna datoteka že priložena, v primeru da ne deluje je potrebno
pregledati Apache nastavitve, oz. popraviti htaccess datoteko
-stran in administratorska plošča je tako pripravljena za delovanje

Povsod v kodi so poti relativne, tako se stran lahko nahaja v kateremkoli imeniku, pomembno je le da datoteke ostanejo skupaj v enaki strukturi.