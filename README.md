# IOI-ALUO-OCE-SIN
Online page: http://www.klement.tk/aluo/

Admin dostop: http://www.klement.tk/aluo/admin
	- User: aluo
	- Pass: adminaluo113

Za delovanje strani je potrebno: Apache, MySQL in PHP

Navodila za postavitev strani:
1. v datoteki conf.php na vrhu spremenite podatke za dostop do MySQL baze ($host, $dbname, $username, $password)
2. preko brskalnika poženite datoteko createDB.php, tako se ustvari ustrezna struktura baze in vnesejo konfiguracijski podatki
3. v datoteko createDB.php na vrhu datoteke spremenite atribut $active iz true na false. Nov zapis bo tako $active = false;
4. celotno mapo admin je potrebno ustrezno zakleniti s htaccess. V kodi je datoteka .htaccess in .htpasswd že priložena, v primeru da ne deluje je potrebno
pregledati Apache nastavitve. Načeloma pa je v datoteki .htaccess pod zapisom "AuthUserFile .htpasswd" mišljena lokacija od korenskega mesta
apache inštalacije (na Windows pri xampp je to 'C:\xampp\apache', pri Linuxu pa verjetno '/etc/apache2/')
5. stran in administratorska plošča je tako pripravljena za delovanje

Povsod v kodi so poti relativne, tako se stran lahko nahaja v kateremkoli imeniku, pomembno je le da datoteke ostanejo skupaj v enaki strukturi.

Vprašanja in kontakt: tursic.klemen@gmail.com

**Prva stran:**
![Stran Stran](/slike/page.png)



**Administrator plošča:**
![Admin plošča Admin plošča](/slike/admin_page.png)
