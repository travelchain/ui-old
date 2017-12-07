import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';

class TelInput extends Component {
  render() {
    const countries = {
      "af":{"code":"af","name":"Afghanistan (‫افغانستان‬‎)","dialCode":93,"phoneFormat":"111 111 1111"},
      "al":{"code":"al","name":"Albania (Shqipëri)","dialCode":355,"phoneFormat":"111 111 1111"},
      "dz":{"code":"dz","name":"Algeria (‫الجزائر‬‎)","dialCode":213,"phoneFormat":"1111 11 11 11"},
      "as":{"code":"as","name":"American Samoa","dialCode":1684,"phoneFormat":"(111) 111-1111"},
      "ad":{"code":"ad","name":"Andorra","dialCode":376,"phoneFormat":"111 111"},
      "ao":{"code":"ao","name":"Angola","dialCode":244,"phoneFormat":"111 111 111"},
      "ai":{"code":"ai","name":"Anguilla","dialCode":1264,"phoneFormat":"(111) 111-1111"},
      "ag":{"code":"ag","name":"Antigua and Barbuda","dialCode":1268,"phoneFormat":"(111) 111-1111"},
      "ar":{"code":"ar","name":"Argentina","dialCode":54,"phoneFormat":"111 11-1111-1111"},
      "am":{"code":"am","name":"Armenia (Հայաստան)","dialCode":374,"phoneFormat":"111 111111"},
      "aw":{"code":"aw","name":"Aruba","dialCode":297,"phoneFormat":"111 1111"},
      "au":{"code":"au","name":"Australia","dialCode":61,"phoneFormat":"1111 111 111"},
      "at":{"code":"at","name":"Austria (Österreich)","dialCode":43,"phoneFormat":"1111 111111"},
      "az":{"code":"az","name":"Azerbaijan (Azərbaycan)","dialCode":994,"phoneFormat":"(111) 111 11 11"},
      "bs":{"code":"bs","name":"Bahamas","dialCode":1242,"phoneFormat":"(111) 111-1111"},
      "bh":{"code":"bh","name":"Bahrain (‫البحرين‬‎)","dialCode":973,"phoneFormat":"1111 1111"},
      "bd":{"code":"bd","name":"Bangladesh (বাংলাদেশ)","dialCode":880,"phoneFormat":"11111-111111"},
      "bb":{"code":"bb","name":"Barbados","dialCode":1246,"phoneFormat":"(246) 250-1234"},
      "by":{"code":"by","name":"Belarus (Беларусь)","dialCode":375,"phoneFormat":"1 111 111-11-11"},
      "be":{"code":"be","name":"Belgium (België)","dialCode":32,"phoneFormat":"1111 11 11 11"},
      "bz":{"code":"bz","name":"Belize","dialCode":501,"phoneFormat":"111-1111"},
      "bj":{"code":"bj","name":"Benin (Bénin)","dialCode":229,"phoneFormat":"11 11 11 11"},
      "bm":{"code":"bm","name":"Bermuda","dialCode":1441,"phoneFormat":"(111) 111-1111"},
      "bt":{"code":"bt","name":"Bhutan (འབྲུག)","dialCode":975,"phoneFormat":"11 11 11 11"},
      "bo":{"code":"bo","name":"Bolivia","dialCode":591,"phoneFormat":"11111111"},
      "ba":{"code":"ba","name":"Bosnia and Herzegovina (Босна и Херцеговина)","dialCode":387,"phoneFormat":"111 111 111"},
      "bw":{"code":"bw","name":"Botswana","dialCode":267,"phoneFormat":"11 111 111"},
      "br":{"code":"br","name":"Brazil (Brasil)","dialCode":55,"phoneFormat":"(11) 11111-1111"},
      "io":{"code":"io","name":"British Indian Ocean Territory","dialCode":246,"phoneFormat":"111 1111"},
      "vg":{"code":"vg","name":"British Virgin Islands","dialCode":1284,"phoneFormat":"(111) 111-1111"},
      "bn":{"code":"bn","name":"Brunei","dialCode":673,"phoneFormat":"111 1111"},
      "bg":{"code":"bg","name":"Bulgaria (България)","dialCode":359,"phoneFormat":"111 111 111"},
      "bf":{"code":"bf","name":"Burkina Faso","dialCode":226,"phoneFormat":"11 11 11 11"},
      "bi":{"code":"bi","name":"Burundi (Uburundi)","dialCode":257,"phoneFormat":"11 11 11 11"},
      "kh":{"code":"kh","name":"Cambodia (កម្ពុជា)","dialCode":855,"phoneFormat":"111 111 111"},
      "cm":{"code":"cm","name":"Cameroon (Cameroun)","dialCode":237,"phoneFormat":"1 11 11 11 11"},
      "ca":{"code":"ca","name":"Canada","dialCode":1,"phoneFormat":"(111) 111-1111"},
      "cv":{"code":"cv","name":"Cape Verde (Kabu Verdi)","dialCode":238,"phoneFormat":"111 11 11"},
      "bq":{"code":"bq","name":"Caribbean Netherlands","dialCode":599,"phoneFormat":"111 1111"},
      "ky":{"code":"ky","name":"Cayman Islands","dialCode":1345,"phoneFormat":"(111) 111-1111"},
      "cf":{"code":"cf","name":"Central African Republic (République centrafricaine)","dialCode":236,"phoneFormat":"11 11 11 11"},
      "td":{"code":"td","name":"Chad (Tchad)","dialCode":235,"phoneFormat":"11 11 11 11"},
      "cl":{"code":"cl","name":"Chile","dialCode":56,"phoneFormat":"11 1111 1111"},
      "cn":{"code":"cn","name":"China (中国)","dialCode":86,"phoneFormat":"111 1111 1111"},
      "cx":{"code":"cx","name":"Christmas Island","dialCode":61,"phoneFormat":"1111 111 111"},
      "cc":{"code":"cc","name":"Cocos (Keeling) Islands","dialCode":61,"phoneFormat":"1111 111 111"},
      "co":{"code":"co","name":"Colombia","dialCode":57,"phoneFormat":"111 1111111"},
      "km":{"code":"km","name":"Comoros (‫جزر القمر‬‎)","dialCode":269,"phoneFormat":"111 11 11"},
      "cd":{"code":"cd","name":"Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo)","dialCode":243,"phoneFormat":"1111 111 111"},
      "cg":{"code":"cg","name":"Congo (Republic) (Congo-Brazzaville)","dialCode":242,"phoneFormat":"11 111 1111"},
      "ck":{"code":"ck","name":"Cook Islands","dialCode":682,"phoneFormat":"11 111"},
      "cr":{"code":"cr","name":"Costa Rica","dialCode":506,"phoneFormat":"1111 1111"},
      "ci":{"code":"ci","name":"Côte d’Ivoire","dialCode":225,"phoneFormat":"11 11 11 11"},
      "hr":{"code":"hr","name":"Croatia (Hrvatska)","dialCode":385,"phoneFormat":"111 111 1111"},
      "cu":{"code":"cu","name":"Cuba","dialCode":53,"phoneFormat":"11 1111111"},
      "cw":{"code":"cw","name":"Curaçao","dialCode":599,"phoneFormat":"1 111 1111"},
      "cy":{"code":"cy","name":"Cyprus (Κύπρος)","dialCode":357,"phoneFormat":"11 111111"},
      "cz":{"code":"cz","name":"Czech Republic (Česká republika)","dialCode":420,"phoneFormat":"111 111 111"},
      "dk":{"code":"dk","name":"Denmark (Danmark)","dialCode":45,"phoneFormat":"11 11 11 11"},
      "dj":{"code":"dj","name":"Djibouti","dialCode":253,"phoneFormat":"11 11 11 11"},
      "dm":{"code":"dm","name":"Dominica","dialCode":1767,"phoneFormat":"(111) 111-1111"},
      "do":{"code":"do","name":"Dominican Republic (República Dominicana)","dialCode":1,"phoneFormat":"(111) 111-1111"},
      "ec":{"code":"ec","name":"Ecuador","dialCode":593,"phoneFormat":"111 111 1111"},
      "eg":{"code":"eg","name":"Egypt (‫مصر‬‎)","dialCode":20,"phoneFormat":"1111 111 1111"},
      "sv":{"code":"sv","name":"El Salvador","dialCode":503,"phoneFormat":"1111 1111"},
      "gq":{"code":"gq","name":"Equatorial Guinea (Guinea Ecuatorial)","dialCode":240,"phoneFormat":"111 111 111"},
      "er":{"code":"er","name":"Eritrea","dialCode":291,"phoneFormat":"11 111 111"},
      "ee":{"code":"ee","name":"Estonia (Eesti)","dialCode":372,"phoneFormat":"1111 1111"},
      "et":{"code":"et","name":"Ethiopia","dialCode":251,"phoneFormat":"111 111 1111"},
      "fk":{"code":"fk","name":"Falkland Islands (Islas Malvinas)","dialCode":500,"phoneFormat":"11111"},
      "fo":{"code":"fo","name":"Faroe Islands (Føroyar)","dialCode":298,"phoneFormat":"111111"},
      "fj":{"code":"fj","name":"Fiji","dialCode":679,"phoneFormat":"111 1111"},
      "fi":{"code":"fi","name":"Finland (Suomi)","dialCode":358,"phoneFormat":"111 1111111"},
      "fr":{"code":"fr","name":"France","dialCode":33,"phoneFormat":"11 11 11 11 11"},
      "gf":{"code":"gf","name":"French Guiana (Guyane française)","dialCode":594,"phoneFormat":"1111 11 11 11"},
      "pf":{"code":"pf","name":"French Polynesia (Polynésie française)","dialCode":689,"phoneFormat":"11 11 11 11"},
      "ga":{"code":"ga","name":"Gabon","dialCode":241,"phoneFormat":"11 11 11 11"},
      "gm":{"code":"gm","name":"Gambia","dialCode":220,"phoneFormat":"111 1111"},
      "ge":{"code":"ge","name":"Georgia (საქართველო)","dialCode":995,"phoneFormat":"111 11 11 11"},
      "de":{"code":"de","name":"Germany (Deutschland)","dialCode":49,"phoneFormat":"11111 1111111"},
      "gh":{"code":"gh","name":"Ghana (Gaana)","dialCode":233,"phoneFormat":"111 111 1111"},
      "gi":{"code":"gi","name":"Gibraltar","dialCode":350,"phoneFormat":"11111111"},
      "gr":{"code":"gr","name":"Greece (Ελλάδα)","dialCode":30,"phoneFormat":"111 111 1111"},
      "gl":{"code":"gl","name":"Greenland (Kalaallit Nunaat)","dialCode":299,"phoneFormat":"11 11 11"},
      "gd":{"code":"gd","name":"Grenada","dialCode":1473,"phoneFormat":"(111) 111-1111"},
      "gp":{"code":"gp","name":"Guadeloupe","dialCode":590,"phoneFormat":"1111 11-1111"},
      "gu":{"code":"gu","name":"Guam","dialCode":1671,"phoneFormat":"(111) 111-1111"},
      "gt":{"code":"gt","name":"Guatemala","dialCode":502,"phoneFormat":"1111 1111"},
      "gg":{"code":"gg","name":"Guernsey","dialCode":44,"phoneFormat":"11111 111111"},
      "gn":{"code":"gn","name":"Guinea (Guinée)","dialCode":224,"phoneFormat":"111 11 11 11"},
      "gw":{"code":"gw","name":"Guinea-Bissau (Guiné Bissau)","dialCode":245,"phoneFormat":"111 111 111"},
      "gy":{"code":"gy","name":"Guyana","dialCode":592,"phoneFormat":"111 1111"},
      "ht":{"code":"ht","name":"Haiti","dialCode":509,"phoneFormat":"11 11 1111"},
      "hn":{"code":"hn","name":"Honduras","dialCode":504,"phoneFormat":"1111-1111"},
      "hk":{"code":"hk","name":"Hong Kong (香港)","dialCode":852,"phoneFormat":"1111 1111"},
      "hu":{"code":"hu","name":"Hungary (Magyarország)","dialCode":36,"phoneFormat":"(11) 111 1111"},
      "is":{"code":"is","name":"Iceland (Ísland)","dialCode":354,"phoneFormat":"111 1111"},
      "in":{"code":"in","name":"India (भारत)","dialCode":91,"phoneFormat":"111111 11111"},
      "id":{"code":"id","name":"Indonesia","dialCode":62,"phoneFormat":"1111-111-111"},
      "ir":{"code":"ir","name":"Iran (‫ایران‬‎)","dialCode":98,"phoneFormat":"1111 111 1111"},
      "iq":{"code":"iq","name":"Iraq (‫العراق‬‎)","dialCode":964,"phoneFormat":"1111 111 1111"},
      "ie":{"code":"ie","name":"Ireland","dialCode":353,"phoneFormat":"111 111 1111"},
      "im":{"code":"im","name":"Isle of Man","dialCode":44,"phoneFormat":"11111 111111"},
      "il":{"code":"il","name":"Israel (‫ישראל‬‎)","dialCode":972,"phoneFormat":"111-111-1111"},
      "it":{"code":"it","name":"Italy (Italia)","dialCode":39,"phoneFormat":"111 111 1111"},
      "jm":{"code":"jm","name":"Jamaica","dialCode":1876,"phoneFormat":"(111) 111-1111"},
      "jp":{"code":"jp","name":"Japan (日本)","dialCode":81,"phoneFormat":"111-1111-1111"},
      "je":{"code":"je","name":"Jersey","dialCode":44,"phoneFormat":"11111 111111"},
      "jo":{"code":"jo","name":"Jordan (‫الأردن‬‎)","dialCode":962,"phoneFormat":"11 1111 1111"},
      "kz":{"code":"kz","name":"Kazakhstan (Казахстан)","dialCode":7,"phoneFormat":"1 (111) 111 1111"},
      "ke":{"code":"ke","name":"Kenya","dialCode":254,"phoneFormat":"1111 111111"},
      "ki":{"code":"ki","name":"Kiribati","dialCode":686,"phoneFormat":"11111111"},
      "kw":{"code":"kw","name":"Kuwait (‫الكويت‬‎)","dialCode":965,"phoneFormat":"111 11111"},
      "kg":{"code":"kg","name":"Kyrgyzstan (Кыргызстан)","dialCode":996,"phoneFormat":"1111 111 111"},
      "la":{"code":"la","name":"Laos (ລາວ)","dialCode":856,"phoneFormat":"111 11 111 111"},
      "lv":{"code":"lv","name":"Latvia (Latvija)","dialCode":371,"phoneFormat":"11 111 111"},
      "lb":{"code":"lb","name":"Lebanon (‫لبنان‬‎)","dialCode":961,"phoneFormat":"11 111 111"},
      "ls":{"code":"ls","name":"Lesotho","dialCode":266,"phoneFormat":"1111 1111"},
      "lr":{"code":"lr","name":"Liberia","dialCode":231,"phoneFormat":"111 111 1111"},
      "ly":{"code":"ly","name":"Libya (‫ليبيا‬‎)","dialCode":218,"phoneFormat":"111-1111111"},
      "li":{"code":"li","name":"Liechtenstein","dialCode":423,"phoneFormat":"111 111 111"},
      "lt":{"code":"lt","name":"Lithuania (Lietuva)","dialCode":370,"phoneFormat":"(1-111) 11111"},
      "lu":{"code":"lu","name":"Luxembourg","dialCode":352,"phoneFormat":"111 111 111"},
      "mo":{"code":"mo","name":"Macau (澳門)","dialCode":853,"phoneFormat":"1111 1111"},
      "mk":{"code":"mk","name":"Macedonia (FYROM) (Македонија)","dialCode":389,"phoneFormat":"111 111 111"},
      "mg":{"code":"mg","name":"Madagascar (Madagasikara)","dialCode":261,"phoneFormat":"111 11 111 11"},
      "mw":{"code":"mw","name":"Malawi","dialCode":265,"phoneFormat":"1111 11 11 11"},
      "my":{"code":"my","name":"Malaysia","dialCode":60,"phoneFormat":"111-111 1111"},
      "mv":{"code":"mv","name":"Maldives","dialCode":960,"phoneFormat":"111-1111"},
      "ml":{"code":"ml","name":"Mali","dialCode":223,"phoneFormat":"11 11 11 11"},
      "mt":{"code":"mt","name":"Malta","dialCode":356,"phoneFormat":"1111 1111"},
      "mh":{"code":"mh","name":"Marshall Islands","dialCode":692,"phoneFormat":"111-1111"},
      "mq":{"code":"mq","name":"Martinique","dialCode":596,"phoneFormat":"1111 11 11 11"},
      "mr":{"code":"mr","name":"Mauritania (‫موريتانيا‬‎)","dialCode":222,"phoneFormat":"11 11 11 11"},
      "mu":{"code":"mu","name":"Mauritius (Moris)","dialCode":230,"phoneFormat":"1111 1111"},
      "yt":{"code":"yt","name":"Mayotte","dialCode":262,"phoneFormat":"1111 11 11 11"},
      "mx":{"code":"mx","name":"Mexico (México)","dialCode":52,"phoneFormat":"111 111 111 1111"},
      "fm":{"code":"fm","name":"Micronesia","dialCode":691,"phoneFormat":"111 1111"},
      "md":{"code":"md","name":"Moldova (Republica Moldova)","dialCode":373,"phoneFormat":"1111 11 111"},
      "mc":{"code":"mc","name":"Monaco","dialCode":377,"phoneFormat":"11 11 11 11 11"},
      "mn":{"code":"mn","name":"Mongolia (Монгол)","dialCode":976,"phoneFormat":"1111 1111"},
      "me":{"code":"me","name":"Montenegro (Crna Gora)","dialCode":382,"phoneFormat":"111 111 111"},
      "ms":{"code":"ms","name":"Montserrat","dialCode":1664,"phoneFormat":"(111) 111-1111"},
      "ma":{"code":"ma","name":"Morocco (‫المغرب‬‎)","dialCode":212,"phoneFormat":"1111-111111"},
      "mz":{"code":"mz","name":"Mozambique (Moçambique)","dialCode":258,"phoneFormat":"11 111 1111"},
      "mm":{"code":"mm","name":"Myanmar (Burma) (မြန်မာ)","dialCode":95,"phoneFormat":"11 111 1111"},
      "na":{"code":"na","name":"Namibia (Namibië)","dialCode":264,"phoneFormat":"111 111 1111"},
      "nr":{"code":"nr","name":"Nauru","dialCode":674,"phoneFormat":"111 1111"},
      "np":{"code":"np","name":"Nepal (नेपाल)","dialCode":977,"phoneFormat":"111-1111111"},
      "nl":{"code":"nl","name":"Netherlands (Nederland)","dialCode":31,"phoneFormat":"11 11111111"},
      "nc":{"code":"nc","name":"New Caledonia (Nouvelle-Calédonie)","dialCode":687,"phoneFormat":"11.11.11"},
      "nz":{"code":"nz","name":"New Zealand","dialCode":64,"phoneFormat":"111 111 1111"},
      "ni":{"code":"ni","name":"Nicaragua","dialCode":505,"phoneFormat":"1111 1111"},
      "ne":{"code":"ne","name":"Niger (Nijar)","dialCode":227,"phoneFormat":"11 11 11 11"},
      "ng":{"code":"ng","name":"Nigeria","dialCode":234,"phoneFormat":"1111 111 1111"},
      "nu":{"code":"nu","name":"Niue","dialCode":683,"phoneFormat":"1111"},
      "nf":{"code":"nf","name":"Norfolk Island","dialCode":672,"phoneFormat":"1 11111"},
      "kp":{"code":"kp","name":"North Korea (조선 민주주의 인민 공화국)","dialCode":850,"phoneFormat":"1111 111 1111"},
      "mp":{"code":"mp","name":"Northern Mariana Islands","dialCode":1670,"phoneFormat":"(111) 111-1111"},
      "no":{"code":"no","name":"Norway (Norge)","dialCode":47,"phoneFormat":"111 11 111"},
      "om":{"code":"om","name":"Oman (‫عُمان‬‎)","dialCode":968,"phoneFormat":"1111 1111"},
      "pk":{"code":"pk","name":"Pakistan (‫پاکستان‬‎)","dialCode":92,"phoneFormat":"1111 1111111"},
      "pw":{"code":"pw","name":"Palau","dialCode":680,"phoneFormat":"111 1111"},
      "ps":{"code":"ps","name":"Palestine (‫فلسطين‬‎)","dialCode":970,"phoneFormat":"1111 111 111"},
      "pa":{"code":"pa","name":"Panama (Panamá)","dialCode":507,"phoneFormat":"1111-1111"},
      "pg":{"code":"pg","name":"Papua New Guinea","dialCode":675,"phoneFormat":"111 1111"},
      "py":{"code":"py","name":"Paraguay","dialCode":595,"phoneFormat":"1111 111111"},
      "pe":{"code":"pe","name":"Peru (Perú)","dialCode":51,"phoneFormat":"111 111 111"},
      "ph":{"code":"ph","name":"Philippines","dialCode":63,"phoneFormat":"1111 111 1111"},
      "pl":{"code":"pl","name":"Poland (Polska)","dialCode":48,"phoneFormat":"111 111 111"},
      "pt":{"code":"pt","name":"Portugal","dialCode":351,"phoneFormat":"111 111 111"},
      "pr":{"code":"pr","name":"Puerto Rico","dialCode":1,"phoneFormat":"(111) 111-1111"},
      "qa":{"code":"qa","name":"Qatar (‫قطر‬‎)","dialCode":974,"phoneFormat":"1111 1111"},
      "re":{"code":"re","name":"Réunion (La Réunion)","dialCode":262,"phoneFormat":"1111 11 11 11"},
      "ro":{"code":"ro","name":"Romania (România)","dialCode":40,"phoneFormat":"1111 111 111"},
      "ru":{"code":"ru","name":"Russia (Россия)","dialCode":7,"phoneFormat":"(111) 111-11-11"},
      "rw":{"code":"rw","name":"Rwanda","dialCode":250,"phoneFormat":"1111 111 111"},
      "bl":{"code":"bl","name":"Saint Barthélemy (Saint-Barthélemy)","dialCode":590,"phoneFormat":"1111 11-1111"},
      "sh":{"code":"sh","name":"Saint Helena","dialCode":290,"phoneFormat":"51234"},
      "kn":{"code":"kn","name":"Saint Kitts and Nevis","dialCode":1869,"phoneFormat":"(111) 111-1111"},
      "lc":{"code":"lc","name":"Saint Lucia","dialCode":1758,"phoneFormat":"(111) 111-1111"},
      "mf":{"code":"mf","name":"Saint Martin (Saint-Martin (partie française))","dialCode":590,"phoneFormat":"1111 11-1111"},
      "pm":{"code":"pm","name":"Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon)","dialCode":508,"phoneFormat":"111 11 11"},
      "vc":{"code":"vc","name":"Saint Vincent and the Grenadines","dialCode":1784,"phoneFormat":"(111) 111-1111"},
      "ws":{"code":"ws","name":"Samoa","dialCode":685,"phoneFormat":"111111"},
      "sm":{"code":"sm","name":"San Marino","dialCode":378,"phoneFormat":"11 11 11 11"},
      "st":{"code":"st","name":"São Tomé and Príncipe (São Tomé e Príncipe)","dialCode":239,"phoneFormat":"111 1111"},
      "sa":{"code":"sa","name":"Saudi Arabia (‫المملكة العربية السعودية‬‎)","dialCode":966,"phoneFormat":"111 111 1111"},
      "sn":{"code":"sn","name":"Senegal (Sénégal)","dialCode":221,"phoneFormat":"11 111 11 11"},
      "rs":{"code":"rs","name":"Serbia (Србија)","dialCode":381,"phoneFormat":"111 1111111"},
      "sc":{"code":"sc","name":"Seychelles","dialCode":248,"phoneFormat":"1 111 111"},
      "sl":{"code":"sl","name":"Sierra Leone","dialCode":232,"phoneFormat":"(111) 111111"},
      "sg":{"code":"sg","name":"Singapore","dialCode":65,"phoneFormat":"1111 1111"},
      "sx":{"code":"sx","name":"Sint Maarten","dialCode":1721,"phoneFormat":"(111) 111-1111"},
      "sk":{"code":"sk","name":"Slovakia (Slovensko)","dialCode":421,"phoneFormat":"1111 111 111"},
      "si":{"code":"si","name":"Slovenia (Slovenija)","dialCode":386,"phoneFormat":"111 111 111"},
      "sb":{"code":"sb","name":"Solomon Islands","dialCode":677,"phoneFormat":"11 11111"},
      "so":{"code":"so","name":"Somalia (Soomaaliya)","dialCode":252,"phoneFormat":"1 1111111"},
      "za":{"code":"za","name":"South Africa","dialCode":27,"phoneFormat":"111 111 1111"},
      "kr":{"code":"kr","name":"South Korea (대한민국)","dialCode":82,"phoneFormat":"111-1111-1111"},
      "ss":{"code":"ss","name":"South Sudan (‫جنوب السودان‬‎)","dialCode":211,"phoneFormat":"1111 111 111"},
      "es":{"code":"es","name":"Spain (España)","dialCode":34,"phoneFormat":"111 11 11 11"},
      "lk":{"code":"lk","name":"Sri Lanka (ශ්‍රී ලංකාව)","dialCode":94,"phoneFormat":"111 111 1111"},
      "sd":{"code":"sd","name":"Sudan (‫السودان‬‎)","dialCode":249,"phoneFormat":"111 111 1111"},
      "sr":{"code":"sr","name":"Suriname","dialCode":597,"phoneFormat":"111-1111"},
      "sj":{"code":"sj","name":"Svalbard and Jan Mayen","dialCode":47,"phoneFormat":"111 11 111"},
      "sz":{"code":"sz","name":"Swaziland","dialCode":268,"phoneFormat":"1111 1111"},
      "se":{"code":"se","name":"Sweden (Sverige)","dialCode":46,"phoneFormat":"111-111 11 11"},
      "ch":{"code":"ch","name":"Switzerland (Schweiz)","dialCode":41,"phoneFormat":"111 111 11 11"},
      "sy":{"code":"sy","name":"Syria (‫سوريا‬‎)","dialCode":963,"phoneFormat":"1111 111 111"},
      "tw":{"code":"tw","name":"Taiwan (台灣)","dialCode":886,"phoneFormat":"1111 111 111"},
      "tj":{"code":"tj","name":"Tajikistan","dialCode":992,"phoneFormat":"(1) 111 11 1111"},
      "tz":{"code":"tz","name":"Tanzania","dialCode":255,"phoneFormat":"1111 111 111"},
      "th":{"code":"th","name":"Thailand (ไทย)","dialCode":66,"phoneFormat":"111 111 1111"},
      "tl":{"code":"tl","name":"Timor-Leste","dialCode":670,"phoneFormat":"1111 1111"},
      "tg":{"code":"tg","name":"Togo","dialCode":228,"phoneFormat":"11 11 11 11"},
      "tk":{"code":"tk","name":"Tokelau","dialCode":690,"phoneFormat":"1111"},
      "to":{"code":"to","name":"Tonga","dialCode":676,"phoneFormat":"111 1111"},
      "tt":{"code":"tt","name":"Trinidad and Tobago","dialCode":1868,"phoneFormat":"(111) 111-1111"},
      "tn":{"code":"tn","name":"Tunisia (‫تونس‬‎)","dialCode":216,"phoneFormat":"11 111 111"},
      "tr":{"code":"tr","name":"Turkey (Türkiye)","dialCode":90,"phoneFormat":"1111 111 11 11"},
      "tm":{"code":"tm","name":"Turkmenistan","dialCode":993,"phoneFormat":"1 11 111111"},
      "tc":{"code":"tc","name":"Turks and Caicos Islands","dialCode":1649,"phoneFormat":"(111) 111-1111"},
      "tv":{"code":"tv","name":"Tuvalu","dialCode":688,"phoneFormat":"111111"},
      "us":{"code":"us","name":"United States","dialCode":1,"phoneFormat":"(111) 111-1111"},
      "gb":{"code":"gb","name":"United Kingdom","dialCode":44,"phoneFormat":"11111 111111"},
      "vi":{"code":"vi","name":"U.S. Virgin Islands","dialCode":1340,"phoneFormat":"(111) 111-1111"},
      "ug":{"code":"ug","name":"Uganda","dialCode":256,"phoneFormat":"1111 111111"},
      "ua":{"code":"ua","name":"Ukraine (Україна)","dialCode":380,"phoneFormat":"(11) 111 1111"},
      "ae":{"code":"ae","name":"United Arab Emirates (‫الإمارات العربية المتحدة‬‎)","dialCode":971,"phoneFormat":"111 111 1111"},
      "uy":{"code":"uy","name":"Uruguay","dialCode":598,"phoneFormat":"111 111 111"},
      "uz":{"code":"uz","name":"Uzbekistan (Oʻzbekiston)","dialCode":998,"phoneFormat":"1 11 111 11 11"},
      "vu":{"code":"vu","name":"Vanuatu","dialCode":678,"phoneFormat":"591 2345"},
      "va":{"code":"va","name":"Vatican City (Città del Vaticano)","dialCode":39,"phoneFormat":"111 111 1111"},
      "ve":{"code":"ve","name":"Venezuela","dialCode":58,"phoneFormat":"1111-1111111"},
      "vn":{"code":"vn","name":"Vietnam (Việt Nam)","dialCode":84,"phoneFormat":"111 111 11 11"},
      "wf":{"code":"wf","name":"Wallis and Futuna","dialCode":681,"phoneFormat":"11 11 11"},
      "eh":{"code":"eh","name":"Western Sahara (‫الصحراء الغربية‬‎)","dialCode":212,"phoneFormat":"1111-111111"},
      "ye":{"code":"ye","name":"Yemen (‫اليمن‬‎)","dialCode":967,"phoneFormat":"1111 111 111"},
      "zm":{"code":"zm","name":"Zambia","dialCode":260,"phoneFormat":"111 1111111"},
      "zw":{"code":"zw","name":"Zimbabwe","dialCode":263,"phoneFormat":"111 111 1111"},
      "ax":{"code":"ax","name":"Åland Islands","dialCode":358,"phoneFormat":"111 1111111"}
    };

    let currentCountryISO2 = this.props.currentCountryISO2;



    return (
      <div>
      {/*<InputMask id={'phone'}*/}
                 {/*alwaysShowMask={true}*/}
                 {/*mask={`+\\${countries[currentCountryISO2].dialCode} ${countries[currentCountryISO2].phoneFormat}`}*/}
                 {/*maskChar=" "*/}
                 {/*formatChars={{*/}
                   {/*'1': '[0-9]',*/}
                   {/*'a': '[A-Za-z]',*/}
                   {/*'*': '[A-Za-z0-9]'*/}
                 {/*}}*/}
                 {/*ref={(input) => { this.props.refCallback(input) }}*/}
                 {/*type="tel"*/}
                 {/*autoComplete={ this.props.autoComplete }*/}
                 {/*className={ this.props.className }*/}
                 {/*disabled={ this.props.disabled ? 'disabled' : false }*/}
                 {/*readOnly={ this.props.readonly ? 'readonly' : false }*/}
                 {/*name={ this.props.fieldName }*/}
                 {/*value={ this.props.value }*/}
                 {/*placeholder={ this.props.placeholder }*/}
                 {/*onChange={ this.props.handleInputChange }*/}
                 {/*onBlur={ this.props.handleOnBlur }*/}
                 {/*autoFocus={ this.props.autoFocus }*/}
      {/*/>*/}
      <input
        { ...this.props.inputProps }
        ref={ this.props.refCallback }
        type="tel"
        autoComplete={ this.props.autoComplete }
        className={ this.props.className }
        disabled={ this.props.disabled ? 'disabled' : false }
        readOnly={ this.props.readonly ? 'readonly' : false }
        name={ this.props.fieldName }
        id={ this.props.fieldId }
        value={ this.props.value }
        placeholder={ this.props.placeholder }
        onChange={ this.props.handleInputChange }
        onBlur={ this.props.handleOnBlur }
        autoFocus={ this.props.autoFocus }
      />
      </div>
    );
  }
}

TelInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool,
  fieldName: PropTypes.string,
  fieldId: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleInputChange: PropTypes.func,
  handleOnBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  inputProps: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  refCallback: PropTypes.func.isRequired,
};

export default TelInput;
