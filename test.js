/*
dale - v4.3.3

Written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.

To run the tests:
   - node.js: enter `node test` at the command prompt.
   - browser: copy the following two lines into a new file and open it with your browser.

// Start copying here

<script src="dale.js"></script>
<script src="test.js"></script>

// End copying here

*/

(function () {

   var isNode = typeof exports === 'object';

   var dale = isNode ? require ('./dale.js') : window.dale;

   dale.perf = true;

   // *** TESTS ***

   var checkCounter = 0;

   var check = function (a, b) {
      checkCounter++;
      if (JSON.stringify (a) !== JSON.stringify (b)) {
         dale.perf = false;
         console.log ('A test just failed!', checkCounter);
         throw new Error ('A test just failed: ' + checkCounter);
      }
   }

   var input = ['a', 'b', 'c'];

   for (var i in input) {
      console.log ('Element #' + (i + 1) + ' is ' + input [i]);
   }

   // This loop will print:
   //    Element #01 is a
   //    Element #11 is b
   //    Element #21 is c

   var output = dale.do (input, function (v, k) {
      console.log ('Element #' + (k + 1) + ' is ' + v);
      return k;
   });

   check (output, [0, 1, 2]);

   // This function will print:
   //    Element #1 is a
   //    Element #2 is b
   //    Element #3 is c

   var argumentsTest = function (A, B, C) {
      return dale.do (arguments, function (v, k) {
         console.log ('Element #' + (k + 1) + ' is ' + v);
         return k;
      });
   }

   // The function invocation below will print:
   //    Element #1 is a
   //    Element #2 is b
   //    Element #3 is c

   output = argumentsTest.apply (argumentsTest, input);

   check (output, [0, 1, 2]);

   var singleParseKeyTest = function () {
      return dale.do ('blabla', function (v, k) {
         console.log ('Element #' + (k + 1) + ' is ' + v);
         return k + 1;
      });
   }

   check (singleParseKeyTest (), [1]);

   var input = [1, 2, 'clank', 4];

   var output = [];

   for (var i in input) {
      if (typeof (input [i]) !== 'number') break;
      else output.push (input [i] * 10);
   }

   console.log (output);

   // output will be [10, 20]

   check (output, [10, 20]);

   output = [];

   dale.stop (input, false, function (v, k) {
      if (typeof (v) !== 'number') return false;
      else output.push (v * 10);
   });

   console.log (output);

   // output will be [10, 20]

   check (output, [10, 20]);

   var data = {
      key: 'value',
      key2: [1, 2, 3],
      key3: dale.do ([1, 2, 3, 4], function (v) {
         return v * 10;
      })
   }

   console.log (data.key3);

   // data.key3 will be equal to [10, 20, 30, 40]
   check (data.key3, [10, 20, 30, 40]);

   console.log (output = dale.do ([1, 2, 3], function (v) {return v + 1}));
   // returns [2, 3, 4]
   check (output, [2, 3, 4]);

   console.log (output = dale.do ({a: 1, b: 2, c: 3}, function (v) {return v + 1}));
   // returns [2, 3, 4]
   check (output, [2, 3, 4]);

   console.log (output = dale.do (1, function (v) {return v + 1}));
   // returns [2]
   check (output, [2]);

   console.log (output = dale.do ({a: 1, b: 2, c: 3}, function (v, k) {return k + v}));
   // returns ['a1', 'b2', 'c3']
   check (output, ['a1', 'b2', 'c3']);

   console.log (output = dale.do ([], function (v, k) {return v + 1}));
   // returns []
   check (output, []);

   console.log (output = dale.do ({}, function (v, k) {return v + 1}));
   // returns []
   check (output, []);

   console.log (output = dale.do (undefined, function (v, k) {return v + 1}));
   // returns []
   check (output, []);

   console.log (output = dale.fil ([{id: 1}, {id: 8}, {id: 14}], undefined, function (v) {
      if (v.id < 10) return v;
   }));

   // returns [{id: 1}, {id: 8}]
   check (output, [{id: 1}, {id: 8}]);

   var members = [
      {name: 'Pepe', active: true},
      {name: 'Dimitri', active: false},
      {name: 'Helmut', active: true}
   ];

   console.log (output = dale.fil (members, undefined, function (v) {
      if (v.active) return {name: v.name};
   }));

   // returns [{name: 'Pepe'}, {name: 'Helmut'}]
   check (output, [{name: 'Pepe'}, {name: 'Helmut'}]);

   console.log (output = dale.keys ({'foo': true, 'bar': false, 'hip': undefined}));

   // returns ['foo', 'bar', 'hip']
   check (output, ['foo', 'bar', 'hip']);

   var isNumber = function (value) {
      if (typeof (value) === 'number') return true;
      else return false;
   }

   console.log (output = dale.stop ([2, 3, 4],       false, isNumber));    // returns true
   check (output, true);
   console.log (output = dale.stop ([2, 'trois', 4], false, isNumber));    // returns false
   check (output, false);
   console.log (output = dale.stop ([],              true,  isNumber));    // returns undefined
   check (output, undefined);
   console.log (output = dale.stop (undefined,       true,  isNumber));    // returns undefined
   check (output, undefined);

   var returnIfNotNumber = function (value) {
      if (typeof (value) === 'number') return true;
      else return value;
   }

   console.log (output = dale.stopNot ([2, 3, 4],       true, returnIfNotNumber));    // returns true
   check (output, true);
   console.log (output = dale.stopNot ([2, 'trois', 4], true, returnIfNotNumber));    // returns 'trois'
   check (output, 'trois');
   console.log (output = dale.stopNot ([],              true, returnIfNotNumber));    // returns undefined
   check (output, undefined);


   var members2 = [
      {name: 'Pepe', age: 68, active: true},
      {name: 'Dimitri', age: 34, active: false},
      {name: 'Helmut', age: 42, active: true}
   ];

   console.log (output = dale.obj (members2, function (v) {
      if (! v.active) return;
      return [v.name, v.age];
   }));

   check (output, {Pepe: 68, Helmut: 42});

   var base = {
      Fritz: 46,
      Sigfrid: 24
   }

   console.log (output = dale.obj (members2, base, function (v) {
      if (! v.active) return;
      return [v.name, v.age];
   }));

   check (output, {Fritz: 46, Sigfrid: 24, Pepe: 68, Helmut: 42});

   check (base, {Fritz: 46, Sigfrid: 24, Pepe: 68, Helmut: 42});

   console.log (output = dale.obj (members2, function (v) {
      return /thisisinvalid/
   }));

   check (output, undefined);

   dale.obj ([], /invalidfun/);
   dale.obj ([], {}, /invalidfun/);

   console.log (output = dale.obj ([], function (v) {
      return [v, v];
   }));

   check (output, {});

   var o1 = {foo: 42}
   var o2 = Object.create (o1); // o2 inherits from o1

   console.log (output = dale.keys (o1));       // returns ['foo']
   check (output, ['foo']);
   console.log (output = dale.keys (o2));       // returns []
   check (output, []);
   console.log (output = dale.keys (o2, true)); // returns ['foo']
   check (output, ['foo']);

   console.log (output = dale.do (o1, function (v) {return v}));       // returns [42]
   check (output, [42]);
   console.log (output = dale.do (o2, function (v) {return v}));       // returns []
   check (output, []);
   console.log (output = dale.do (o2, function (v) {return v}, true)); // returns [42]
   check (output, [42]);

   console.log (output = dale.acc ([1, 2, 3], function (a, b) {return a + b}));
   check (output, 6);

   console.log (output = dale.acc ({x: 1, y: 2, z: 3}, function (a, b) {return a + b}));
   check (output, 6);

   console.log (output = dale.acc ([1, 2, 3], function (a, b) {return a * b}));
   check (output, 6);

   console.log (output = dale.acc ([1], function (a, b) {return a + b}));
   check (output, 1);

   console.log (output = dale.acc ([2, 3], function (a, b) {return a + b}));
   check (output, 5);

   console.log (output = dale.acc ([], 0, function (a, b) {return a + b}));
   check (output, 0);

   console.log (output = dale.acc ([], 3, function (a, b) {return a + b}));
   check (output, 3);

   console.log (output = dale.acc ([1], 0, function (a, b) {return a + b}));
   check (output, 1);

   console.log (output = dale.acc ([2, 3], 1, function (a, b) {return a + b}));
   check (output, 6);

   console.log (output = dale.acc (['A', 'B', 'C'], function (a, b) {return a + b}));
   check (output, 'ABC');

   console.log (output = dale.acc ([1, 2, 3], /notafunction/));
   check (output, false);

   console.log (output = dale.do (dale.times (3), function (v) {return v + 1}));
   check (output, [2, 3, 4]); // returns [2, 3, 4]

   console.log (output = dale.fil (dale.times (4), undefined, function (v) {if (v % 2 === 0) return v;}));
   check (output, [2, 4]); // returns [2, 4]

   console.log (output = dale.obj (dale.times (2), function (v, k) {
      if (v % 2 === 0) return [k, v];
   }));
   check (output, {1: 2}); // returns {1: 2}

   console.log (output = dale.stop (dale.times (2), false, function (v, k) {
      return v % 3 !== 0;
   }));
   check (output, true); // output will be true

   console.log (output = dale.stop (dale.times (4), false, function (v, k) {
      return v % 3 !== 0;
   }));
   check (output, false); // output will be false

   console.log (output = dale.keys (dale.times (4)));
   check (output, [0, 1, 2, 3]); // returns [0, 1, 2, 3]

   console.log (output = dale.do (dale.times (4, 0, 2), function (v) {return v}));
   check (output, [0, 2, 4, 6]); // returns [0, 2, 4, 6]

   console.log (output = dale.do (1, function (v) {return v + 1}));
   check (output, [2]); // returns [2]

   console.log (output = dale.fil (1, 3, function (v) {return v + 1}));
   check (output, [2]); // returns [2]

   console.log (output = dale.stop (1, 1, function (v) {return v}));
   check (output, 1); // returns 1

   console.log (output = dale.stopNot (1, 1, function (v) {return v}));
   check (output, 1); // returns 1

   console.log (output = dale.obj (1, function (v) {return [v, v]}));
   check (output, {1: 1}); // returns {1: 1}

   console.log (output = dale.times (0));
   check (output, []); // returns []

   console.log (output = dale.acc (dale.times (5), function (a, b) {return a + b}));
   check (output, 15); // returns 15

   check (undefined, dale.times (0.5));
   check (undefined, dale.times (1, /a/));
   check (undefined, dale.times (1, 1, /a/));

   console.log ('\nAll tests passed successfully!\n');

   // *** PERFORMANCE ***

   // Generated with http://www.generatedata.com/
   var users = {
      columns: ["Id","Name","Email","Address","City","Region","Country","Geolocation"],
      data: [["8FD885B8-B3CE-6E7B-E256-D483BF2F063D","Wylie","Donec.feugiat@mauris.ca","148-1720 Eu St.","Bharatpur","Rajasthan","Korea, South","-54.67525, -4.31423"],["85624A1C-AD8C-D599-C1B6-C0C41FA6E5B1","Bree","non@Sednecmetus.co.uk","6556 Ante Road","Częstochowa","Sląskie","Moldova","-17.70027, 13.07993"],["7F3FA315-309E-E13C-B936-4208668DBF30","Minerva","Mauris.magna.Duis@estac.com","5826 Ullamcorper Street","Sosnowiec","Sląskie","Nigeria","-18.53188, -2.3058"],["D023045D-AE4B-DA1B-690F-7E917E789E3E","Mary","Sed.nunc.est@ipsumdolor.co.uk","7013 Arcu St.","Algeciras","Andalucía","Uruguay","-4.27216, -40.74605"],["3D58C56E-86EB-9D05-5685-40895147CBDB","Lars","Phasellus.ornare.Fusce@molestiedapibus.com","2905 Orci. Street","Abeokuta","OG","Zimbabwe","-87.56398, 11.66559"],["D636E7F4-9549-0925-DED0-A3CADA07BE11","Risa","scelerisque@Fuscedolorquam.edu","781-9212 Purus Street","Dannevirke","NI","Niue","8.97156, 75.66954"],["7AAFC420-3A32-AD28-124E-16ABCBF4940C","Courtney","libero.lacus.varius@pedeetrisus.net","P.O. Box 655, 3730 Justo Rd.","Guarapuava","PR","Tonga","41.15721, -27.22224"],["2AF02EDB-D3D1-7494-D6C4-329C2EB23C59","Dexter","convallis.in.cursus@luctusut.com","Ap #624-5041 Eu, Street","Porirua","NI","Nicaragua","-89.49184, -101.8297"],["564D1CC7-5C64-B860-4774-1135FC76FFA1","Caesar","nonummy.ultricies.ornare@nonummy.ca","Ap #603-7218 Etiam Rd.","Whitchurch-Stouffville","Ontario","Tuvalu","-87.30826, -9.6801"],["869CB1A8-F382-AB26-B980-9FD4DEF68E29","Brenda","eu@risusIn.net","Ap #853-1767 Eget St.","Pukekohe","NI","Benin","-58.79685, 3.3711"],["5DE160ED-7B25-61A9-3479-CD8CC3BAE457","Lance","magnis.dis.parturient@Maurismagna.edu","P.O. Box 659, 4375 Vulputate Road","Bovigny","Luxemburg","Faroe Islands","-30.3723, -5.45229"],["395C7C92-9A58-4D77-6A33-F40358F46F41","Karly","blandit.viverra@neque.co.uk","Ap #378-5414 Eu St.","Baton Rouge","LA","Bermuda","-78.91623, -145.35612"],["88E477A0-8AA1-7167-2143-204E8C0BF24D","Maisie","Aliquam.erat.volutpat@dis.ca","Ap #984-8697 Donec Av.","Hastings","NI","Zambia","-74.33632, 74.74191"],["679742D5-B6FE-115A-FF08-F9B3A84DFE56","Perry","risus@lectus.co.uk","9715 Faucibus Ave","Segovia","Castilla y León","Macedonia","69.05659, -126.24175"],["FA5A5071-80B2-9AB0-771F-083CB155AAA1","Velma","Proin.vel@egettinciduntdui.co.uk","615-4917 Congue Ave","Warszawa","MA","Philippines","-17.57505, -173.78579"],["A5154B64-64BF-AF9A-706E-5A1A9BDAB237","Isadora","eu.ultrices.sit@eleifendnuncrisus.org","Ap #497-674 Erat. Rd.","Bareilly","UP","Svalbard and Jan Mayen Islands","31.25608, -155.25939"],["85C605E0-67BE-258F-BF43-F2B2F3BB433F","Valentine","malesuada.ut@enimcommodohendrerit.co.uk","1192 Faucibus St.","İslahiye","Gaziantep","Egypt","-82.16408, -171.31633"],["5143373A-BF3D-CABA-2725-BA67D28BF51F","Audra","enim@ultricesiaculis.ca","3709 Donec St.","Berlin","Berlin","Switzerland","-48.19043, 126.78316"],["FD0EAE3B-2E1F-917E-CBC1-EC6513D538BB","Ignacia","non.sapien.molestie@gravida.ca","P.O. Box 287, 9171 Vivamus Avenue","Delhi","Delhi","Bolivia","76.40064, 166.42935"],["4AD9291F-FF5B-BBAE-2506-6864776F6965","Rachel","magna.tellus.faucibus@sempereratin.edu","Ap #858-5126 Nunc St.","Juazeiro","Bahia","Saint Helena, Ascension and Tristan da Cunha","79.51139, 41.45528"],["4490F73B-52E5-7C88-54A1-E27D5F221BC0","Yoshi","ridiculus.mus.Aenean@DuisgravidaPraesent.co.uk","Ap #182-2086 Iaculis Avenue","Arnhem","Gelderland","Guinea","35.7325, 11.81757"],["806FCEF9-383C-F956-493B-B05EA00D1356","Gillian","Nullam.ut@consectetuercursus.com","Ap #675-7363 Mollis Rd.","Nadrin","LX","Slovenia","50.85985, 177.36245"],["EA3CE87E-4EAA-A5DF-8A77-0A3990CAF3C0","Tatum","et@odioPhasellusat.edu","Ap #242-7710 Elit, Ave","Zamość","LU","Costa Rica","52.34129, -59.77715"],["5556D1AA-6317-B658-87B3-6610838E60BF","Jackson","auctor@sitametconsectetuer.net","609-9029 Pede. Street","Dublin","L","Poland","-87.04169, -50.06143"],["291DD682-7927-0890-AA78-3C9C467592F3","Cora","pharetra.Nam.ac@posuerecubilia.com","Ap #542-136 Egestas, Rd.","Gouda","Z.","Qatar","70.93558, -108.16355"],["58DFDED5-5404-3DBA-3C7A-9AE9B8A3982E","Maggie","amet.consectetuer.adipiscing@fringillaDonecfeugiat.co.uk","P.O. Box 859, 9666 Laoreet Rd.","Galashiels","SE","Holy See (Vatican City State)","-33.86834, 35.34003"],["138B5D63-826D-1C62-BB96-FDD40AACC90B","Joy","orci@vulputate.com","455-5500 In Rd.","Ramara","Ontario","Suriname","69.21164, 153.43608"],["F87E8C10-7BAF-E560-CF23-D690110F4253","Elmo","malesuada.vel.convallis@natoque.net","Ap #370-5805 Sed Road","Warszawa","MA","Mexico","44.99531, 48.2685"],["0AFA67F7-DCAF-E6D2-4C87-7F5096A2E1DA","Stacey","tortor@gravida.ca","307-9256 Ligula Rd.","Tczew","Pomorskie","Greenland","-50.45795, -11.38665"],["E73DE63A-3EE9-CEE3-9836-345C7C3AF533","Sage","Aliquam.rutrum@quis.com","Ap #894-6331 Ut, Av.","Macclesfield","CH","Djibouti","70.00463, -80.85479"],["3FACF60F-F49B-3E05-7B55-D3491873C0CD","Kelsey","cubilia@non.com","Ap #413-679 Pellentesque Rd.","Flushing","Zl","Peru","-14.52506, -5.13715"],["80F43C0F-BD90-9C1C-952F-26FB5620A086","Jermaine","magnis.dis@venenatis.net","Ap #151-1057 Ac Road","Dutse","JI","Sweden","-66.70301, 10.34653"],["AE10969A-06AB-A745-71CC-3DA6571F46C0","Scott","quam.Curabitur@arcuMorbisit.ca","5623 Lorem, St.","Olmen","AN","Macedonia","19.75008, 173.51747"],["51DD30A6-8564-A392-8443-283B8C06D432","Colleen","vel@ProinultricesDuis.co.uk","P.O. Box 798, 7962 Nec St.","Redcliffe","Queensland","Viet Nam","-88.10118, -137.38884"],["CC998A32-1203-CF49-49E8-B125D0E132BF","Rhea","libero.at@veliteusem.net","P.O. Box 815, 8635 Elit. Rd.","Adrano","Sicilia","Isle of Man","37.6211, -169.12355"],["CD683556-5425-239B-F043-3C622ED6D18E","Lani","dolor.Donec.fringilla@Sed.co.uk","Ap #711-504 Egestas Road","Berlin","BE","Maldives","-1.75473, -53.09576"],["DF8E25A1-A2DF-9917-3132-D996850D8F21","Jared","ipsum.dolor@nibhPhasellus.edu","202-3753 Pharetra, Rd.","Llanidloes","Montgomeryshire","Hungary","66.40487, 154.13414"],["7422930C-BBFA-CA7D-8A22-DA2C38E924EA","Alexander","molestie.tortor.nibh@orci.net","490-8023 Eleifend Rd.","Shivapuri","Madhya Pradesh","Pakistan","6.14102, 154.09288"],["F5ACF194-1B52-D7CD-370B-5E5AFA4A84AE","Perry","et.euismod.et@luctus.org","P.O. Box 676, 2089 At, Av.","Kingston","Ontario","Wallis and Futuna","36.92242, -7.16073"],["2CDB0C61-550D-143E-D453-7ECEE997C2B0","Ryan","vestibulum.neque.sed@tristiquesenectuset.com","P.O. Box 932, 8739 Feugiat St.","Holyhead","AG","New Zealand","-25.92511, -125.57478"],["888AB46A-41DE-20F0-63CE-675154827C65","Aidan","tincidunt.Donec@Nullaeget.edu","597 Consectetuer Ave","Kirkby Lonsdale","Westmorland","Russian Federation","-63.7593, 130.84552"],["643285AC-7731-FBD7-0A7E-CBA65CD3C935","Tashya","erat.volutpat.Nulla@ridiculus.co.uk","587-6275 Gravida Rd.","Wałbrzych","DS","Burundi","-6.76015, 164.45867"],["4E8CB5C2-709F-E9C9-ED8F-5FBB03C54106","Declan","sodales.nisi.magna@Donecfelis.org","581 Enim Rd.","Frankfort","KY","Kuwait","21.26712, 6.8231"],["12D70F23-9B1C-70DE-F54D-A7B89F96A320","Sage","tempus.non.lacinia@Aliquamgravidamauris.edu","6988 Vitae St.","Desamparados","SJ","Cayman Islands","-31.24796, -116.61883"],["E08F6E41-4DFB-189F-A04E-3460920E7896","Kennan","Morbi@ut.net","9335 Magna Ave","Abeokuta","Ogun","Pitcairn Islands","-78.23005, -174.21567"],["AFA2FB81-CD6A-C67C-83C4-E1D862E23E21","Clarke","massa@Inlorem.edu","Ap #497-4648 Feugiat Rd.","Dublin","Leinster","Jordan","-27.26727, 145.08274"],["EF5CC22C-FCB5-5D7B-DE29-CE66DBA5043F","Casey","pellentesque.tellus@eratvolutpatNulla.com","Ap #173-1456 Ultricies Ave","Carapicuíba","SP","Lithuania","-10.54096, -60.79698"],["6A17A31E-04BE-99CD-EF7F-0C15BFFF2653","Reese","molestie.in.tempus@Donecnibh.com","Ap #634-4557 Aptent Rd.","Belfast","Ulster","Sierra Leone","-57.33674, -175.34262"],["E79195F5-27CB-95AC-3E24-BA33F7949AED","Cecilia","purus@urnaetarcu.edu","8662 Justo Street","A Coruña","GA","Norfolk Island","44.87749, 42.59734"],["BEC4A94B-6887-885E-D88E-B1CB3C5BF3AC","Wilma","porttitor.vulputate.posuere@Donecsollicitudin.ca","P.O. Box 548, 9902 Libero St.","Bundaberg","QLD","Luxembourg","-2.11941, -89.17653"],["439F5137-1833-8E82-7C38-64A6168F8486","Abraham","scelerisque.neque.sed@est.ca","P.O. Box 298, 441 Pretium St.","Zaria","Kaduna","Guinea","86.53083, 6.89714"],["4DECEEBA-2C25-51B1-439C-EDBCAD3B95A6","Kermit","ipsum.Curabitur@tincidunttempus.net","5336 Arcu. Av.","Ajaccio","CO","Serbia","35.5604, -49.92418"],["D03A3590-642C-4D93-D2E1-40647467EAD5","Nathan","diam@duisemper.com","Ap #262-9049 Facilisis. Rd.","San Cristóbal de la Laguna","CN","Seychelles","-9.04979, 48.07418"],["FE2A5D92-260F-D7E5-2B84-92CACBE3B9DB","Adam","Fusce.fermentum@milacinia.net","616-6201 Est, Avenue","Palmariggi","Puglia","Guyana","-31.4191, -118.29379"],["F1BE87AD-3050-B418-E917-C26522617734","Jeanette","a@mollisnon.net","P.O. Box 109, 2185 Metus. Ave","Salamanca","Castilla y León","Marshall Islands","16.14709, 69.83409"],["9F52F80F-239B-90ED-53B7-45E68FAFFAD4","Orla","Integer.eu.lacus@montesnasceturridiculus.com","3707 Dictum Av.","Henderson","NV","Western Sahara","-16.34963, 139.60402"],["1371AE72-ACB8-2F29-3F2E-AB9D5A293534","Haley","blandit.enim@luctus.co.uk","278-9507 Laoreet Ave","Reno","NV","Micronesia","61.78112, 126.83343"],["BE019B79-95BA-2164-C238-752F7BC5F4D2","Edward","nonummy.Fusce.fermentum@eutellusPhasellus.com","516-4735 Augue, Street","Blois","CE","Korea, South","-29.92644, -53.44641"],["17BE28E5-1AC9-FFC0-5188-BAC049CEA14D","Arsenio","Vivamus@ipsumSuspendissesagittis.ca","365-3400 Erat Avenue","Santa Coloma de Gramenet","Catalunya","Guinea","72.45837, -29.74461"],["E84CE244-BEB6-348F-E111-B73F8AA630A6","Anika","rhoncus.Proin@ornare.com","827-9176 Tellus. St.","Owerri","Imo","Solomon Islands","-25.88698, -178.69202"],["5FCC68EB-5693-9E4C-BBA8-89B2E52910AC","Jade","leo@Maurisnon.ca","P.O. Box 311, 303 Nunc. Av.","Vienna","Wie","Afghanistan","-26.21989, 123.15378"],["A7902F0D-8FFE-625C-CA90-61FE76FEBAFC","Tyler","Quisque.fringilla.euismod@dolor.net","987-3523 Aliquet, Rd.","Georgia","GA","Sweden","64.86994, 161.42126"],["7F1C14F4-A121-307C-FBDF-2AC102037AE7","Otto","dolor.Nulla@ametconsectetuer.co.uk","417-5750 Aenean Avenue","Berwick-upon-Tweed","Northumberland","Romania","-49.19835, -45.07955"],["D6D9D71B-75D8-7201-9961-860CBE24F83A","Micah","pede@risusquisdiam.ca","P.O. Box 540, 8566 Lobortis. Rd.","Rycroft","Alberta","Ethiopia","-67.05874, 61.6768"],["8E0B67D2-6F92-53D9-796D-689D3B206BC4","Prescott","egestas@feugiatnecdiam.net","Ap #369-537 Luctus Ave","Palayankottai","Tamil Nadu","Kyrgyzstan","-54.87675, -18.74499"],["1070E916-CC70-D64E-1972-5CF1DDF43D69","Sandra","in@egestasDuis.com","6019 Sed Road","Igboho","OY","Nauru","73.46894, -146.10446"],["F7407A69-521F-B190-4DB6-6D6D1738C1D2","Gloria","Duis.mi.enim@rhoncus.com","Ap #419-7317 Enim Street","Berlin","BE","Philippines","-54.62275, 156.21792"],["D005D7D3-519C-20A2-0CE1-ACB6C064879C","Melissa","arcu@Sedpharetra.ca","P.O. Box 500, 4789 Vehicula Road","Portsoy","BA","Antigua and Barbuda","56.08609, -100.90904"],["483B89A5-B181-7DA8-DB81-6C9770F07D86","Brian","sed@dictummiac.co.uk","Ap #779-2909 Mi Road","Dehradun","UT","Venezuela","-74.46026, -109.32515"],["888F9209-63C4-76FE-9218-C98F9FF467CB","Omar","parturient.montes.nascetur@varius.org","P.O. Box 549, 7181 Morbi Street","Dublin","Leinster","Comoros","-81.50189, 121.58911"],["43B89FFC-E43E-0741-2F2B-3EE8E093BFE2","Julie","vulputate@cursus.net","2953 Porttitor St.","Bathgate","West Lothian","Moldova","83.03869, 103.22532"],["A131546A-DF2B-D5D0-C9DB-A071E71D6B81","Odysseus","Nulla.facilisi.Sed@orciinconsequat.net","Ap #170-7975 Eu, Av.","Zonhoven","Limburg","Guernsey","-75.23083, 62.25103"],["8E2C03CE-EFE5-FEFF-1816-C775ADE591C7","Ciaran","cursus.Integer@nonduinec.co.uk","2825 A Street","Barranca","Puntarenas","Niger","28.75864, -69.23865"],["892ED451-D553-15BC-406C-E7797CE3D152","Alden","quis.accumsan@tinciduntdui.ca","2359 Turpis. Rd.","Kawawachikamach","Quebec","Tuvalu","-69.5841, 21.90751"],["D0505DE1-B2C2-99BF-F6EF-AF534EE299CC","Callie","tortor.nibh@dignissimtemporarcu.net","Ap #975-3697 Erat, Ave","Gorzów Wielkopolski","Lubuskie","Jordan","81.07252, 66.07694"],["679DC608-A4BE-35EA-40CF-6A575B497C56","Hiroko","semper.Nam@CrasinterdumNunc.co.uk","499-3766 Vitae Rd.","Vertou","PA","Laos","-55.47311, 1.65508"],["E953EADE-64BC-A873-2B79-1E6807703803","Allegra","diam.Sed@justoProinnon.co.uk","P.O. Box 645, 2346 Mi. Rd.","Vienna","Vienna","Suriname","-22.18599, -111.53228"],["7F48BE1B-2E6B-9A5F-E312-F57ABF15ED46","Megan","aliquet.sem@dis.edu","1802 Etiam Rd.","Helmond","Noord Brabant","Kazakhstan","24.97723, -163.3038"],["D68E2AB8-1F16-24D8-96C9-A2575BCAEACE","Ramona","pede.malesuada@elementum.com","5846 Adipiscing, Av.","Berlin","Berlin","Niue","-63.38529, -86.24322"],["B78B2D87-0484-7430-0648-E66520EF9911","Solomon","sem.mollis@posuere.org","3651 Natoque Ave","Częstochowa","Sląskie","Barbados","-36.00317, 42.48864"],["D2760E31-E7B0-F5DE-4B44-B58B6D6DF8AE","Megan","Vivamus.molestie.dapibus@sitamet.org","7662 Condimentum Rd.","Sala Baganza","Emilia-Romagna","Sao Tome and Principe","-35.82549, -144.14114"],["DC052F7B-6336-6203-1F33-7CF16D5347A5","Len","Nunc@tempor.co.uk","614-8589 Blandit Ave","Burhaniye","Bal","Turks and Caicos Islands","77.07064, -121.95114"],["67CD0C1B-0EED-8F58-5CDA-8CF0BA7AB290","Kadeem","lectus@arcuCurabitur.com","462-8033 Nunc Av.","Bihar Sharif","BR","Greece","1.85919, -116.41388"],["4F178D1D-AD05-D068-A661-F04E36204CCE","Kelly","ornare.lectus@Loremipsumdolor.com","8090 Libero Av.","Las Vegas","Nevada","Armenia","-29.23962, 112.83205"],["661F38EF-E390-4D3B-EB39-AE82AAA4D24E","Gillian","Donec.est.Nunc@Fuscealiquetmagna.ca","7495 Aliquet Street","Alajuela","Alajuela","Falkland Islands","-34.98785, 75.8945"],["7CB154FF-CFCC-157D-8329-6B19CB8746C7","Bradley","consectetuer.ipsum.nunc@tristique.com","P.O. Box 335, 6224 Tellus Street","Joliet","Illinois","Finland","-71.38299, 146.36644"],["23639E18-1DCA-E19D-568C-D9EAD6069EC7","Anthony","semper.pretium.neque@milaciniamattis.net","P.O. Box 694, 1996 Eget Av.","Picton","South Island","Christmas Island","74.58229, -152.80736"],["6513B873-0305-F57F-F4C2-43A30D0F9565","Yuli","dictum.eu@vitaealiquet.edu","486 Pellentesque Av.","Glauchau","SN","Indonesia","-25.3015, 174.62735"],["6246358E-3A4A-ACFE-28D5-5996A8B38EB0","Herrod","a.nunc.In@urnaconvallis.ca","P.O. Box 386, 1286 Non Ave","Nelson","British Columbia","Malaysia","-68.76966, 67.34213"],["A9F51FFD-68DD-780F-5535-B21E12F473E5","Pandora","accumsan.interdum.libero@nuncestmollis.org","Ap #280-7795 Interdum. Rd.","Piracicaba","SP","Egypt","7.16859, 55.66532"],["7002A459-22B8-08C7-52AA-ADF83A04FF7A","Irma","Cum.sociis@ultricies.org","P.O. Box 200, 3142 Mattis. Rd.","Berlin","Berlin","United Kingdom (Great Britain)","88.10238, 134.87056"],["AEF2CAA4-496C-7D4B-947C-ACC98AB62283","Theodore","lacus.Aliquam.rutrum@disparturientmontes.edu","5954 Nascetur Road","Curridabat","SJ","Panama","-82.66672, 173.84378"],["91C80205-8E82-FCF8-9DEB-AA73C9BDF855","Maxine","feugiat@vitaeeratVivamus.ca","781-9378 Enim St.","Tarsus","Mer","British Indian Ocean Territory","-89.54761, -19.48141"],["42E62E4D-9AB6-42CA-0D82-500789ABDE4B","Erasmus","hendrerit.neque@Duisat.net","Ap #691-9696 Elementum Rd.","Mielec","Podkarpackie","Lesotho","1.35865, 70.48224"],["BAB51801-89CF-BEC1-0DCC-65CA8DD25593","Yoshio","aliquet.magna@Pellentesque.com","454-3500 A, Av.","Dubbo","New South Wales","Lithuania","-69.24017, -32.22488"],["39CA0D8C-3926-1AE4-9F52-B72EDC814CA4","Julian","tellus.non.magna@tristique.org","5606 Nostra, Road","Mauá","São Paulo","Aruba","-9.16099, 80.78494"],["AD7ED578-A088-91BD-6232-3BB4916B391D","Rae","pede.ultrices.a@etmagnis.com","P.O. Box 337, 4793 Congue, Av.","Midlands","Ontario","Congo, the Democratic Republic of the","-29.77498, -31.21519"],["5E533F75-FBE0-A2CB-0C58-79465F263BAF","Graiden","Cum.sociis@anteMaecenasmi.net","8561 Eleifend Rd.","Dordrecht","Zuid Holland","Brazil","25.41672, 28.45843"],["895CCE98-3083-6326-3579-3603AC2F808F","Miranda","eros@pharetraut.com","599-6528 Lobortis, Rd.","College","Alaska","Mauritania","-36.07415, 146.2493"],["AA320E31-16E2-B139-02A5-9A77BE728F4B","Maia","eget.metus.In@montes.org","Ap #314-7801 A, Avenue","Istanbul","Ist","Gambia","45.9775, 110.867"]]
   }

   function forArray () {
      var output = {};
      for (var user in users.data) {
         var User = {};
         for (var field in users.data [user]) {
            if (field !== '0') User [users.columns [field]] = users.data [user] [field];
         }
         output [users.data [user] [0]] = User;
      }
      return output;
   }

   function daleArray () {
      return dale.obj (users.data, function (user, userKey) {
         return [user [0], dale.obj (user, function (value, key) {
            if (key !== 0) return [users.columns [key], value];
         })];
      });
   }

   var object = forArray ();

   function forObject () {
      var output = [];
      for (var user in object) {
         var User = [['id', user]];
         for (var field in object [user]) {
            User.push ([field, object [user] [field]]);
         }
         output.push (User);
      }
      return output;
   }

   function daleObject (hasOwn) {
      return dale.do (object, function (user, id) {
         var User = [['id', id]];
         dale.do (user, function (value, key) {
            User.push ([key, value]);
          }, hasOwn);
         return User;
      }, hasOwn);
   }

   function daleObjectOwn () {
      return daleObject (true);
   }

   var benchmark = function (fun, times) {
      var oTimes = times;
      var start = Date.now ();
      // I briefly doubted whether to do a for loop or a dale invocation here, until I weaseled out with a while loop.
      while (times) {
         fun ();
         times--;
      }
      var end = Date.now ();
      console.log ((fun + '').match (/^function [A-Za-z0-9_]+/) [0], '\t', 'executed', oTimes, 'times in', '\t', end - start, 'milliseconds');
      return end - start;
   }

   var multiBenchmark = function (times, iterations) {
      // We check that the test functions return the same output.
      check (forArray (),  daleArray ());
      check (forObject (), daleObject ());
      check (forObject (), daleObjectOwn ());

      var result = {aFor: 0, aDale: 0, oFor: 0, oDale: 0, oDaleObj: 0};

      while (times) {
         result.aFor     += benchmark (forArray, iterations);
         result.aDale    += benchmark (daleArray, iterations);
         console.log ('----------------------------');
         result.oFor     += benchmark (forObject, iterations);
         result.oDale    += benchmark (daleObject, iterations);
         result.oDaleObj += benchmark (daleObjectOwn, iterations);
         console.log ('----------------------------');
         times--;
      }
      console.log ('\nforArray: 1x,\ndaleArray: ' + ((result.aDale / result.aFor) + '').slice (0, 5) + 'x\n');
      console.log ('forObject: 1x,\ndaleObject: ' + ((result.oDale / result.oFor) + '').slice (0, 5) + 'x\ndaleObjectOwn: ' + ((result.oDaleObj / result.oFor) + '').slice (0, 5) + 'x\n');
      if (dale.perf === true) dale.perf = result;
   }

   // Run the benchmark 5 times, with 2000 iterations per test function.
   multiBenchmark (5, 2000);

}) ();
