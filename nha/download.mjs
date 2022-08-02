/*
	npm i slugify node-fetch jsdom xml-formatter
*/

import slugify from 'slugify'
import fetch from 'node-fetch'
import jsdom from 'jsdom'
import fs from 'fs'
import format from 'xml-formatter'
import assert from 'node:assert'

/*
a lista de hinos foi obtida abrindo-se as playlists do canal https://www.youtube.com/channel/UCUKoNHIKf7mIknt77DIPfjQ
e rodando o snippet a seguir pelo console: 

var items = document.querySelectorAll('#playlist-items #video-title');
var names = [];
for (var i = 0; i < items.length; i++) names.push(items[i].innerText);
console.log(names);
*/

var hinos = ['Hino 1 - Santo, Santo, Santo', 'Hino 2 - Ó Adorai o Senhor', 'Hino 3 - O Deus Eterno Reina', 'Hino 4 - Louvor ao Trino Deus', 'Hino 5 - Jubilosos Te Adoramos', 'Hino 6 - Nós Te Adoramos', 'Hino 7 - Sejas Louvado', 'Hino 8 - Ó Deus de Amor', 'Hino 9 - Santo, Santo, Pai Bondoso', 'Hino 10 - O Senhor Está Aqui', 'Hino 11 - Maior Que Tudo', 'Hino 12 - Vinde, Povo do Senhor', 'Hino 13 - Louvamos-Te, Ó Deus', 'Hino 14 - Louvemos o Rei', 'Hino 15 - Tu És Fiel, Senhor', 'Hino 16 - Sublime Amor', 'Hino 17 - Deus É Nosso Pai Amado', 'Hino 18 - Deus É Nosso Pai Celeste', 'Hino 19 - A Deus Demos Glória', 'Hino 20 - Grande É o Senhor', 'Hino 21 - Eu Te Amo, Ó Deus', 'Hino 22 - A Ti Toda Glória', 'Hino 23 - Louvai a Cristo', 'Hino 24 - Rei dos Reis', 'Hino 25 - Jesus, Sempre Te Amo', 'Hino 26 - Saudai o Nome de Jesus', 'Hino 27 - Com Glória Coroai', 'Hino 28 - Lindo És, Meu Mestre', 'Hino 29 - O Amor de Jesus', 'Hino 30 - Sempre Vencendo', 'Hino 31 - Jesus, Tu És a Minha Vida', 'Hino 32 - Brilha Jesus', 'Hino 33 - A Esperança É Jesus', 'Hino 34 - Precioso Nome', 'Hino 35 - Ele É Exaltado', 'Hino 36 - Por Seu Imenso Amor', 'Hino 37 - Cristo', 'Hino 38 - A Ti Rendemos Glórias', 'Hino 39 - Glórias ao Rei de Amor', 'Hino 40 - Concede-Nos o Espírito', 'Hino 41 - Chuvas de Bênçãos', 'Hino 42 - Vive em Mim', 'Hino 43 - Vem, Santo Espírito, Agora', 'Hino 44 - O Santo Espírito', 'Hino 45 - Suave Espírito', 'Hino 46 - Dia de Chuva', 'Hino 47 - Cheios do Espírito', 'Hino 48 - O Poder do Espírito', 'Hino 49 - Que Firme Alicerce', 'Hino 50 - Que Alicerce Seguro', 'Hino 51 - Dá-Me a Bíblia', 'Hino 52 - Novas de Amor e Vida', 'Hino 53 - Que Diz a Bíblia?', 'Hino 54 - Unidos pela Palavra', 'Hino 55 - Tua Palavra', 'Hino 56 - Nossa Inspiração', 'Hino 57 - A Palavra do Senhor', 'Hino 58 - O Pão da Vida', 'Hino 59 - Por Belezas Naturais', 'Hino 60 - Ao Deus de Abraão Louvai', 'Hino 61 - Vós, Criaturas do Senhor', 'Hino 62 - Quão Grande És Tu', 'Hino 63 - O Mundo É de Meu Deus', 'Hino 64 - Vaso Novo', 'Hino 65 - Das Mãos do Criador', 'Hino 66 - Não Há Outro Igual a Você', 'Hino 67 - Restaura em Mim', 'Hino 68 - Restaura', 'Hino 69 - Obrigado, Bom Pai', 'Hino 70 - A Real Bandeira', 'Hino 71 - Vitória em Cristo', 'Hino 72 - Firme nas Promessas', 'Hino 73 - Castelo Forte', 'Hino 74 - Grande Comandante', 'Hino 75 - Fé É a Vitória', 'Hino 76 - Vencedor Cada Dia', 'Hino 77 - Ó Cristãos, Avante!', 'Hino 78 - Um Vencedor', 'Hino 79 - Noite de Paz', 'Hino 80 - Soou em Meio à Noite Azul', 'Hino 81 - Surgem Anjos Proclamando', 'Hino 82 - Num Berço de Palha', 'Hino 83 - Canção da Manjedoura', 'Hino 84 - Ó Vinde, Adoremos', 'Hino 85 - Estrela de Luz', 'Hino 86 - Nasce Jesus', 'Hino 87 - Belém, Bendita És', 'Hino 88 - Cristo Nasceu', 'Hino 89 - Natal! Feliz Natal!', 'Hino 90 - Glória ao Rei Que Vos Nasceu', 'Hino 91 - Ó Noite Santa!', 'Hino 92 - Onde Estavam?', 'Hino 93 - Nasceu o Salvador', 'Hino 94 - Vestido em Linho', 'Hino 95 - Amor Que por Amor Desceste', 'Hino 96 - Foi Amor', 'Hino 97 - Por Que Me Amou Assim?', 'Hino 98 - Conta-Me a História de Cristo', 'Hino 99 - Conta-Me a Velha História', 'Hino 100 - A Doce História', 'Hino 101 - Seu Maravilhoso Olhar', 'Hino 102 - Ó Vem! Emanuel', 'Hino 103 - Rude Cruz', 'Hino 104 - Na Senda do Calvário', 'Hino 105 - Oh! Fronte Ensanguentada!', 'Hino 106 - Cristo no Horto', 'Hino 107 - Na Cruz Morri por Ti', 'Hino 108 - Foi por Você Também', 'Hino 109 - Houve Alguém', 'Hino 110 - Monte do Calvário', 'Hino 111 - Ao Ver a Cruz', 'Hino 112 - Cordeiro de Deus', 'Hino 113 - ´Stavas Lá?', 'Hino 114 - Cristo Já Ressuscitou', 'Hino 115 - Preciosa Graça', 'Hino 116 - Maravilhosa Graça', 'Hino 117 - Infinita Graça', 'Hino 118 - Imenso Amor', 'Hino 119 - Graça de Deus', 'Hino 120 - Graça', 'Hino 121 - Por um Pecador Qual Eu', 'Hino 122 - Só um Passo', 'Hino 123 - Seu Sangue Tem Poder', 'Hino 124 - Deixa a Luz do Céu Entrar', 'Hino 125 - A Terna Voz do Salvador', 'Hino 126 - Foge para o Monte', 'Hino 127 - Vida em Olhar', 'Hino 128 - Se Tu Buscares a Jesus', 'Hino 129 - Deixa Entrar o Rei da Glória', 'Hino 130 - Jesus Está Esperando', 'Hino 131 - Manso e Suave', 'Hino 132 - Pra Quem Nada Tem', 'Hino 133 - Ó Vem, Aflito Coração', 'Hino 134 - Junto à Cruz', 'Hino 135 - Vinde às Águas', 'Hino 136 - Quero Estar ao Pé da Cruz', 'Hino 137 - Pai, Eu Me Achego a Ti', 'Hino 138 - Tal Qual Estou', 'Hino 139 - Sou de Jesus Agora', 'Hino 140 - Ao Pé da Cruz de Cristo', 'Hino 141 - Cristo Tocou-Me', 'Hino 142 - Perdão, Poder e Paz', 'Hino 143 - Ao Olhar pra Cruz', 'Hino 144 - Foi na Cruz', 'Hino 145 - É Jesus o Salvador', 'Hino 146 - Eu Não Sou Mais Eu', 'Hino 147 - Jesus Me Transformou', 'Hino 148 - Jesus Achou-Me', 'Hino 149 - Pedras', 'Hino 150 - Ó Jesus, Habita em Mim', 'Hino 151 - Amor Glorioso', 'Hino 152 - A Voz de Jesus', 'Hino 153 - O Que Penso de Meu Mestre', 'Hino 154 - Alvo Mais Que a Neve', 'Hino 155 - Meu Cálice Transborda', 'Hino 156 - Remido', 'Hino 157 - Jesus Me Remiu', 'Hino 158 - Creio em Milagres', 'Hino 159 - Um Novo Nome Lá na Glória', 'Hino 160 - Crescendo em Graça', 'Hino 161 - Salva-Me Também', 'Hino 162 - Sou de Jesus', 'Hino 163 - Para o Céu por Jesus Irei', 'Hino 164 - Meu Nome em Suas Mãos', 'Hino 165 - Hoje Sou Feliz', 'Hino 166 - Caminhando', 'Hino 167 - Tão Triste Eu Andava', 'Hino 168 - Eu Achei', 'Hino 169 - Salvo em Jesus', 'Hino 170 - Oh! Que Belo Hino Deus Me Deu', 'Hino 171 - Com Cristo no Meu Coração', 'Hino 172 - Ando Sempre Alegre', 'Hino 173 - Que Prazer É Ser de Cristo', 'Hino 174 - Que Consolo e Paz!', 'Hino 175 - De Ti Careço, Ó Deus', 'Hino 176 - Nunca Desanimes', 'Hino 177 - Conduze-Me, Meu Mestre', 'Hino 178 - Deus Cuidará de Ti', 'Hino 179 - Eu Sei em Quem Eu Creio', 'Hino 180 - Nunca Te Deixarei', 'Hino 181 - Cuidará de Mim Também', 'Hino 182 - Eu Pertenço ao Meu Rei', 'Hino 183 - Oh, Não Temas, Sou Contigo', 'Hino 184 - Quero Ter Jesus Comigo', 'Hino 185 - Cada Momento', 'Hino 186 - Ó Mestre, o Mar Se Revolta', 'Hino 187 - Refúgio em Temporal', 'Hino 188 - Minha Esperança', 'Hino 189 - Deus Sabe, Deus Ouve, Deus Vê', 'Hino 190 - Pertenço a Cristo', 'Hino 191 - Olha Com Fé para Cima', 'Hino 192 - Brilho Celeste', 'Hino 193 - Sob Suas Asas', 'Hino 194 - Tem Fé em Deus', 'Hino 195 - Minha Fé Bem Segura Está', 'Hino 196 - Ao Jesus Me Tomar a Mão', 'Hino 197 - Sou Feliz Com Jesus', 'Hino 198 - Deus Vos Guarde', 'Hino 199 - Ao Passares pelas Águas', 'Hino 200 - Nunca Me Deixar', 'Hino 201 - Dia a Dia', 'Hino 202 - Não Ando Só', 'Hino 203 - Abrigo na Rocha', 'Hino 204 - Meu Divino Protetor', 'Hino 205 - Ergo os Meus Olhos', 'Hino 206 - Fixa Teus Olhos no Mestre', 'Hino 207 - Confiei no Meu Senhor', 'Hino 208 - Confia em Deus', 'Hino 209 - Todas as Coisas Contribuem', 'Hino 210 - Sempre Confiante', 'Hino 211 - Jesus Meu Guia É', 'Hino 212 - Bendita Segurança', 'Hino 213 - Não Me Esqueci de Ti', 'Hino 214 - Não Há o Que Temer', 'Hino 215 - A Única Saída', 'Hino 216 - Pode Cair o Mundo', 'Hino 217 - Fé dos Nossos Pais', 'Hino 218 - Ouve-Nos, Pastor Divino', 'Hino 219 - Da Igreja o Fundamento', 'Hino 220 - Fortalece Tua Igreja', 'Hino 221 - Somos Igreja', 'Hino 222 - Somos um Pequeno Povo', 'Hino 223 - Há um Dever', 'Hino 224 - Mensagem ao Mundo', 'Hino 225 - Dai-Nos Luz', 'Hino 226 - Cristo nos Conclama', 'Hino 227 - Se Cristo For Comigo', 'Hino 228 - Onde Quer Que Seja', 'Hino 229 - Trabalho Cristão', 'Hino 230 - Ao Mundo Vou Contar', 'Hino 231 - Trabalhar e Orar', 'Hino 232 - Jesus Precisa de Ti', 'Hino 233 - Brilha por Cristo em Teu Viver', 'Hino 234 - Hoje Ajuda Alguém', 'Hino 235 - Somos Teus, Senhor', 'Hino 236 - Transbordando em Amor', 'Hino 237 - A Colheita', 'Hino 238 - Oração pela Missão', 'Hino 239 - Geração Esperança', 'Hino 240 - Brilhar por Ti', 'Hino 241 - A Todo Semelhante Meu', 'Hino 242 - Benditos Laços', 'Hino 243 - Jesus, Pastor Amado', 'Hino 244 - Ó Vem à Igreja Comigo', 'Hino 245 - Lado a Lado', 'Hino 246 - Em Família', 'Hino 247 - Unidos em Cristo', 'Hino 248 - Encontros', 'Hino 249 - Oh! Que Belos Hinos!', 'Hino 250 - A Jesus Seguir Eu Quero', 'Hino 251 - Meu Jesus Está Chamando', 'Hino 252 - Volto ao Lar', 'Hino 253 - Importa Renascer', 'Hino 254 - Agora Posso Ver', 'Hino 255 - As Águas Batismais', 'Hino 256 - A Ceia do Senhor', 'Hino 257 - Senhor, Tu nos Convidas', 'Hino 258 - A Última Ceia', 'Hino 259 - Em Memória de Ti', 'Hino 260 - Em Memória de Mim', 'Hino 261 - Quem Se Dispõe a Ir?', 'Hino 262 - Irei Aonde Jesus Mandar', 'Hino 263 - Mãos', 'Hino 264 - Envio a Ti', 'Hino 265 - Faz-Me um Servo', 'Hino 266 - No Serviço do Meu Rei', 'Hino 267 - As Searas Maduras', 'Hino 268 - Compensa Servir a Jesus', 'Hino 269 - Sal da Terra', 'Hino 270 - Vaso de Bênção', 'Hino 271 - Vaso de Honra', 'Hino 272 - Através de Nós', 'Hino 273 - A Escola Sabatina', 'Hino 274 - O Encontro', 'Hino 275 - Hino dos Aventureiros', 'Hino 276 - Hino dos Desbravadores', 'Hino 277 - Bem-Aventurança', 'Hino 278 - A Voz de Deus', 'Hino 279 - A Verdade Brilhará', 'Hino 280 - O Espírito de Profecia', 'Hino 281 - Filhos da Promessa', 'Hino 282 - Em Sua Presença', 'Hino 283 - Crer e Observar', 'Hino 284 - Obedecer É Melhor', 'Hino 285 - Eu Amo a Tua Lei', 'Hino 286 - Tua Lei', 'Hino 287 - A Lei de Deus', 'Hino 288 - Fiel a Toda Prova', 'Hino 289 - A Tua Lei', 'Hino 290 - Do Santo Sábado És Senhor', 'Hino 291 - Sábado do Meu Senhor', 'Hino 292 - Sábado', 'Hino 293 - O Sábado Chegou', 'Hino 294 - Lembre-Se do Sábado', 'Hino 295 - Sábado Bendito', 'Hino 296 - Bem-Vindo o Sábado', 'Hino 297 - Dia de Esperança', 'Hino 298 - Deus Fez o Sábado para Mim', 'Hino 299 - Dia Santo', 'Hino 300 - Tempo de Ser Santo', 'Hino 301 - Toma, Ó Deus, Meu Coração', 'Hino 302 - Tudo Entregarei', 'Hino 303 - Minha Entrega', 'Hino 304 - Que Te Darei, Meu Mestre?', 'Hino 305 - Sobre o Altar', 'Hino 306 - Eis-Nos Prontos', 'Hino 307 - Conta as Bênçãos', 'Hino 308 - Faze Como Daniel', 'Hino 309 - Em Tuas Mãos', 'Hino 310 - Entrega', 'Hino 311 - Inteiramente Fiel', 'Hino 312 - Nas Tuas Mãos', 'Hino 313 - Tudo para Deus', 'Hino 314 - Se Ele Não For o Primeiro', 'Hino 315 - A Cristo Eu Amo', 'Hino 316 - Achei um Grande Amigo', 'Hino 317 - Amigo Mui Precioso', 'Hino 318 - Cantarei de Meu Jesus', 'Hino 319 - Cristo É Tudo para Mim', 'Hino 320 - Eu Te Amo, Meu Mestre', 'Hino 321 - Jesus É Melhor', 'Hino 322 - Jesus Me Guia', 'Hino 323 - Há um Amigo', 'Hino 324 - Jesus Teu Nome Satisfaz', 'Hino 325 - Junto ao Bondoso Deus', 'Hino 326 - Manancial de Toda Bênção', 'Hino 327 - Não Há Amigo Igual a Cristo', 'Hino 328 - Meu Deus e Eu', 'Hino 329 - Não Há Nome Mais Amável', 'Hino 330 - O Melhor Amigo', 'Hino 331 - Nome Precioso', 'Hino 332 - Tudo És para Mim', 'Hino 333 - Oh! Que Amigo em Cristo Temos', 'Hino 334 - Oh, Eu Amo a Cristo!', 'Hino 335 - Precioso É Jesus para Mim', 'Hino 336 - Salmo dos Salmos', 'Hino 337 - Amor nos Faz Contentes', 'Hino 338 - Deus Não Se Cansa de Amar', 'Hino 339 - Eu Sou um Pobre Peregrino', 'Hino 340 - Sou Forasteiro Aqui', 'Hino 341 - Mágoas', 'Hino 342 - Eu Não Te Deixarei', 'Hino 343 - Meu Refúgio Está no Monte', 'Hino 344 - Confiarei', 'Hino 345 - Novo Dia Chegará', 'Hino 346 - Como Agradecer', 'Hino 347 - Obrigado', 'Hino 348 - Graças', 'Hino 349 - Gratidão', 'Hino 350 - Senhor Jesus, Muito Obrigado', 'Hino 351 - Jesus, Muito Obrigado', 'Hino 352 - Luz Bendita, Luz Gloriosa', 'Hino 353 - É Prazer Servir a Cristo', 'Hino 354 - Paz', 'Hino 355 - Sempre Alegre', 'Hino 356 - Tenho um Hino em Meu Coração', 'Hino 357 - Bendita Hora de Oração', 'Hino 358 - Só Com Teu Deus', 'Hino 359 - Lugar de Paz', 'Hino 360 - Deus Ouve, Deus Responde', 'Hino 361 - Deus nos Ouvirá', 'Hino 362 - O Melhor Lugar do Mundo', 'Hino 363 - O Jardim de Oração', 'Hino 364 - Que Tempo Já Faz?', 'Hino 365 - Santa Hora de Oração', 'Hino 366 - No Jardim', 'Hino 367 - Falar Com Deus', 'Hino 368 - Ao Teu Lado Quero Andar', 'Hino 369 - Seguindo a Jesus', 'Hino 370 - Bem Junto a Cristo', 'Hino 371 - Cada Vez Mais Puro', 'Hino 372 - Abre, Senhor, os Olhos Meus', 'Hino 373 - Deixa-Me Contigo Andar', 'Hino 374 - Contigo, Ó Deus, Almejo Andar', 'Hino 375 - Canção da Vida', 'Hino 376 - Cristo, Dá-Nos Tua Paz', 'Hino 377 - Mais de Cristo', 'Hino 378 - Mais Perto Quero Estar', 'Hino 379 - Fala à Minh`alma', 'Hino 380 - Sonda-Me, Ó Deus', 'Hino 381 - Teu Divinal Amor', 'Hino 382 - Minha Oração', 'Hino 383 - Em Mim Vem Habitar', 'Hino 384 - O Teu Querer', 'Hino 385 - Música Celeste', 'Hino 386 - Abre Meus Olhos', 'Hino 387 - Jesus, Não Eu', 'Hino 388 - Sê Minha Vida', 'Hino 389 - Minha Cruz', 'Hino 390 - Pegadas', 'Hino 391 - Queremos Dar Louvor', 'Hino 392 - Ser Igual a Cristo', 'Hino 393 - Vem Comigo Habitar', 'Hino 394 - De Hoje em Diante', 'Hino 395 - Vem Brilhar', 'Hino 396 - Vem Brilhar em Mim', 'Hino 397 - Eu Só Quero Estar Onde Estás', 'Hino 398 - Pai, Vive em Mim', 'Hino 399 - O Céu É Jesus', 'Hino 400 - Mais Semelhante a Jesus', 'Hino 401 - Quero Ter Jesus', 'Hino 402 - Perto de Jesus', 'Hino 403 - Renova-Me', 'Hino 404 - Sempre de Jesus', 'Hino 405 - Vem, Ó Senhor', 'Hino 406 - Pés na Terra, Olhos no Céu', 'Hino 407 - O Poder do Amor', 'Hino 408 - Abençoa Este Lar', 'Hino 409 - Amor no Lar', 'Hino 410 - Vem Entre Nós Morar', 'Hino 411 - Bem de Manhã', 'Hino 412 - Bem Cedinho Sempre Busco', 'Hino 413 - Vigiar e Orar', 'Hino 414 - Desponta o Sol', 'Hino 415 - Luzes da Aurora', 'Hino 416 - Surge a Alvorada', 'Hini 417 - Perto do Lar', 'Hino 418 - Finda o Dia', 'Hino 419 - Prece Vespertina', 'Hino 420 - Hora Feliz do Pôr do Sol', 'Hino 421 - Oração para uma Criança', 'Hino 422 - Presente de Valor', 'Hino 423 - Não os Impeçais', 'Hino 424 - Canção para Meu Bebê', 'Hino 425 - Ouço o Clamor do Bom Pastor', 'Hino 426 - Cristo Ama as Criancinhas', 'Hino 427 - Venham, Crianças', 'Hino 428 - Joias Preciosas', 'Hino 429 - Quando o Livro Aberto For', 'Hino 430 - O Juízo', 'Hino 431 - Vem o Grande Dia', 'Hino 432 - Sangue Precioso de Cristo', 'Hino 433 - Sumo-Sacerdote', 'Hino 434 - Santuário', 'Hino 435 - Acima do Céu', 'Hino 436 - E Me Fareis um Santuário', 'Hino 437 - Chegou a Hora', 'Hino 438 - Quando For Chamado', 'Hino 439 - Quando Deus Fizer Chamada', 'Hino 440 - Breve Jesus Voltará', 'Hino 441 - Vencendo Vem Jesus', 'Hino 442 - Jesus Voltará', 'Hino 443 - Cristo Virá Outra Vez', 'Hino 444 - Oh! Que Esperança!', 'Hino 445 - O Rei Já Perto Está', 'Hino 446 - Cristo Vem', 'Hino 447 - Vigiai, Cristãos', 'Hino 448 - Nós o Veremos', 'Hino 449 - Quando o Rei Vier', 'Hino 450 - Guarda, Vê Se Muito Falta', 'Hino 451 - Grande Alegria', 'Hino 452 - Cristo Não Tarda Voltar', 'Hino 453 - Anunciai pelas Montanhas', 'Hino 454 - A Manhã Gloriosa', 'Hino 455 - Verei Jesus', 'Hino 456 - Bela Manhã', 'Hino 457 - Jesus Vem Logo', 'Hino 458 - Não Tardará', 'Hino 459 - Cada Dia Mais Perto', 'Hino 460 - Decidi Olhar pra o Amanhã', 'Hino 461 - Jesus Precisa Voltar', 'Hino 462 - Será de Manhã?', 'Hino 463 - Espero a Manhã Radiosa', 'Hino 464 - Não Desistir', 'Hino 465 - O Dia Não Sei', 'Hino 466 - Um Pouco Mais', 'Hino 467 - Até Quando?', 'Hino 468 - Quase no Lar', 'Hino 469 - Enquanto Ele Não Vem', 'Hino 470 - Rocha Eterna', 'Hino 471 - Porque Ele Vive', 'Hino 472 - Ó Alegrai-Vos, Filhos de Sião', 'Hino 473 - Morte e Ressurreição', 'Hino 474 - Eu Espero', 'Hino 475 - Se Não Houver Amanhã', 'Hino 476 - Hei de Ver', 'Hino 477 - Face a Face', 'Hino 478 - Sim, Glória Haverá no Final', 'Hino 479 - Herdeiro do Reino', 'Hino 480 - O Eterno Lar', 'Hino 481 - No Celeste Lar Glorioso', 'Hino 482 - Junto ao Rio Jordão', 'Hino 483 - Vamos Ver Jesus Ali', 'Hino 484 - Além do Céu Azul', 'Hino 485 - Estrelas Terei', 'Hino 486 - Até Então', 'Hino 487 - Primeiro Quero Ver Meu Salvador', 'Hino 488 - Eu Vou para o Céu', 'Hino 489 - Cristo Foi Preparar um Lugar', 'Hino 490 - Tão Grato Me É Lembrar', 'Hino 491 - Há um Rio Cristalino', 'Hino 492 - Lar Feliz', 'Hino 493 - Almejo o Lar', 'Hino 494 - Doce Lar', 'Hino 495 - Glória Perene', 'Hino 496 - Além do Rio', 'Hino 497 - Inda É Longe Canaã?', 'Hino 498 - Lindo País', 'Hino 499 - Mansão Sobre o Monte', 'Hino 500 - Oh! Nunca Separar', 'Hino 501 - Para Além das Montanhas', 'Hino 502 - Saudade', 'Hino 503 - Vale do Éden, Formoso', 'Hino 504 - Mais Perto Deste Lar', 'Hino 505 - Muito Além do Sol', 'Hino 506 - Eu Não Preciso Mais Sonhar', 'Hino 507 - Jamais Se Diz Adeus Ali', 'Hino 508 - Cristo Fez Tudo Muito Bom', 'Hino 509 - A Criação', 'Hino 510 - Aquarela do Senhor', 'Hino 511 - Eu Sou uma Obra de Arte', 'Hino 512 - Cada Dia', 'Hino 513 - Ver Jesus em Você', 'Hino 514 - Fruto da Criação', 'Hino 515 - Sabe Quantas Estrelinhas?', 'Hino 516 - Grande Artista', 'Hino 517 - Meu Deus É Tão Grande', 'Hino 518 - O Dia em Que Deus Criou o Mundo', 'Hino 519 - O Amigo do Coração', 'Hino 520 - Cristo É o Número Um', 'Hino 521 - O Espírito Santo', 'Hino 522 - Eu Quero Esse Poder', 'Hino 523 - Sim, Cristo Me Ama', 'Hino 524 - Jesus Me Quer Bem', 'Hino 525 - Deus Sempre Me Ama', 'Hino 526 - Quem Orou Três Vezes?', 'Hino 527 - Aonde Quer Que Eu Vá', 'Hino 528 - Quando Estou Com Medo', 'Hino 529 - Se Deus É por Nós', 'Hino 530 - Lâmpada para os Meus Pés', 'Hino 531 - A Bíblia', 'Hino 532 - Louvem a Jesus', 'Hino 533 - Louvai-O', 'Hino 534 - Eu Digo Não', 'Hino 535 - Santa Lei de Deus', 'Hino 536 - São Dez os Mandamentos', 'Hino 537 - Sábado, o Dia Mais Feliz', 'Hino 538 - Dia Especial', 'Hino 539 - Deus Mandou o Sol Brilhar', 'Hino 540 - Quero Bem Alegre Obedecer', 'Hino 541 - Cria em Mim, Ó Deus', 'Hino 542 - Vem, Ó Jesus', 'Hino 543 - É Bom Ter Jesus no Coração', 'Hino 544 - Entrega Teu Caminho ao Senhor', 'Hino 545 - Sou Feliz', 'Hino 546 - Quero Servir a Jesus', 'Hino 547 - Eu Sei Porque Nasci', 'Hino 548 - O Milagre da Vida', 'Hino 549 - Eu Sou Importante', 'Hino 550 - Deus Tem um Plano pra Mim', 'Hino 551 - Minha Pequenina Luz', 'Hino 552 - Meus Talentos Vou Usar', 'Hino 553 - Minha Vida É uma Viagem', 'Hino 554 - Sou Aventureiro', 'Hino 555 - Um Lugar Feliz É o Céu', 'Hino 556 - Lá no Céu', 'Hino 557 - O Céu', 'Hino 558 - O Senhor Está em Seu Templo', 'Hino 559 - Sinto a Presença do Senhor', 'Hino 560 - A Glória da Tua Presença', 'Hino 561 - Santo Somente É o Senhor', 'Hino 562 - Santo És, Senhor', 'Hino 563 - Sua Glória', 'Hino 564 - Vamos Adorar', 'Hino 565 - Adoração', 'Hino 566 - Oh! Adorai', 'Hino 567 - Intróito', 'Hino 568 - Invocação', 'Hino 569 - Nosso Maravilhoso Deus', 'Hino 570 - Maravilhoso Deus', 'Hino 571 - Tu És Digno', 'Hino 572 - Ofertório', 'Hino 573 - Venho Te Adorar', 'Hino 574 - Teu É Nosso Coração', 'Hino 575 - Entrego a Ti', 'Hino 576 - Humildade e Gratidão', 'Hino 577 - Quero Me Entregar', 'Hino 578 - Humilde Oração', 'Hino 579 - Ao Orarmos, Senhor', 'Hino 580 - Oração de Súplica', 'Hino 581 - Ouve-Nos, Senhor', 'Hino 582 - Pai, Venho a Ti', 'Hino 583 - Entregamos em Tuas Mãos', 'Hino 584 - Prece de Gratidão', 'Hino 585 - Vem, Espírito Santo', 'Hino 586 - Venham Todos', 'Hino 587 - Chegou a Hora de Adorar ao Senhor - A', 'Hino 587 - Chegou a Hora de Adorar ao Senhor - B', 'Hino 588 - Deixai Vir a Mim os Pequeninos', 'Hino 589 - Fala, Senhor', 'Hino 590 - Queremos Te Pedir', 'Hino 591 - Estejas Conosco', 'Hino 592 - Graça, Amor e Comunhão', 'Hino 593 - Amigo, Não Saia Sem Cristo', 'Hino 594 - Bênção Final', 'Hino 595 - A Benção', 'Hini 596 - Vem, Senhor', 'Hino 597 - Santo Lugar', 'Hino 598 - Que Deus Te Abençoe', 'Hino 599 - Que o Senhor nos Abençoe!', 'Hino 600 - Em Paz Eu Vou'];

// alguns hinos possuem URLs diferentes
var exceptions = {
	'38': 'https://www.letras.mus.br/novo-hinario-adventista/a-ti-rendemos-gloria/a-ti-rendemos-gloria-print.html',
	'39': 'https://www.letras.mus.br/novo-hinario-adventista/gloria-ao-rei-do-amor/gloria-ao-rei-do-amor-print.html',
	'43': 'https://www.letras.mus.br/novo-hinario-adventista/vem-santo-espirito-agora/vem-santo-espi-rito-agora-print.html',
	'50': 'https://www.letras.mus.br/novo-hinario-adventista/alicerce-seguro/alicerce-seguro-print.html',
	'62': 'https://www.letras.mus.br/novo-hinario-adventista/quao-grande-es-tu/qua-o-grande-e-s-tu-print.html',
	'65': 'https://www.letras.mus.br/novo-hinario-adventista/das-maos-do-criador/das-ma-os-do-criador-print.html',
	'77': 'https://www.letras.mus.br/novo-hinario-adventista/o-cristaos-avante/o-crista-os-avante-print.html',
	'119': 'https://www.letras.mus.br/novo-hinario-adventista/119-graca-de-deus/grac-a-de-deus-print.html',
	'146': 'https://www.letras.mus.br/novo-hinario-adventista/eu-nao-sou-mais-eu/eu-na-o-sou-mais-eu-print.html',
	'234': 'https://www.letras.mus.br/novo-hinario-adventista/hoje-ajuda-a-alguem/hoje-ajuda-a-alguem-print.html',
	'238': 'https://www.letras.mus.br/novo-hinario-adventista/oracao-pela-missao/orac-a-o-pela-missa-o-print.html',
	'246': 'https://www.letras.mus.br/novo-hinario-adventista/em-familia/em-fami-lia-print.html',
	'255': 'https://www.letras.mus.br/novo-hinario-adventista/as-aguas-batismais/as-a-guas-batismais-print.html',
	'297': 'https://www.letras.mus.br/novo-hinario-adventista/dia-de-esperanca/dia-de-esperanc-a-print.html',
	'325': 'https://www.letras.mus.br/novo-hinario-adventista/junto-ao-bondoso-deus/ao-bondoso-deus-print.html',
	'332': 'https://www.letras.mus.br/novo-hinario-adventista/tudo-es-pra-mim/tudo-es-pra-mim-print.html',
	'440': 'https://www.letras.mus.br/hinario-adventista/breve-jesus-voltara/breve-jesus-voltara-print.html',
	'441': 'https://www.letras.mus.br/hinario-adventista/vencendo-vem-jesus/vencendo-vem-jesus-print.html',
	'504': 'https://www.letras.mus.br/novo-hinario-adventista/mais-perto-desse-lar/mais-perto-desse-lar-print.html',
	'509': 'https://www.letras.mus.br/novo-hinario-adventista/criacao/criacao-print.html',
	'519': 'https://www.letras.mus.br/novo-hinario-adventista/amigo-do-coracao/amigo-do-coracao-print.html',
	'543': 'https://www.letras.mus.br/novo-hinario-adventista/e-bom-ter-jesus-no-coracao/e-bom-ter-jesus-no-corac-a-o-print.html',
	'547': 'https://www.letras.mus.br/novo-hinario-adventista/eu-sei-por-que-nasci/eu-sei-por-que-nasci-print.html',
	'558': 'https://www.letras.mus.br/hinario-adventista/o-senhor-esta-no-seu-templo/o-senhor-esta-no-seu-templo-print.html',
	'562': 'https://www.letras.mus.br/novo-hinario-adventista/santo-es-senhor/santo-e-s-senhor-print.html',
	'567': 'https://www.letras.mus.br/novo-hinario-adventista/introito/intro-ito-print.html',
	'590': 'https://www.letras.mus.br/novo-hinario-adventista/queremos-te-pedir-senhor/queremos-te-pedir-senhor-print.html',
	'599': 'https://www.letras.mus.br/novo-hinario-adventista/que-o-senhor-nos-abencoe/que-o-senhor-nos-abenc-oe-print.html',
	'456': 'https://www.letras.mus.br/hinario-adventista/bela-manha/bela-manha-print.html',
	'448': 'https://www.letras.mus.br/hinario-adventista/1592090/nos-o-veremos-print.html',
	'450': 'https://www.letras.mus.br/hinario-adventista/guarda-ve-se-muito-falta/guarda-ve-se-muito-falta-print.html',
	'451': 'https://www.letras.mus.br/hinario-adventista/grande-alegria/grande-alegria-print.html',
	'442': 'https://www.letras.mus.br/hinario-adventista/jesus-voltara/jesus-voltara-print.html',
	'443': 'https://www.letras.mus.br/hinario-adventista/1592092/cristo-vira-outra-vez-print.html',
	'445': 'https://www.letras.mus.br/hinario-adventista/o-rei-vindouro/o-rei-vindouro-print.html',
	'446': 'https://www.letras.mus.br/hinario-adventista/1592091/cristo-vem-print.html',
	'447': 'https://www.letras.mus.br/hinario-adventista/vigiai-cristaos/vigiai-cristaos-print.html',
	'449': 'https://www.letras.mus.br/hinario-adventista/1591999/quando-o-rei-vier-print.html',
	'452': 'https://www.letras.mus.br/hinario-adventista/cristo-nao-tarda-a-voltar/cristo-nao-tarda-a-voltar-print.html',
	'453': 'https://www.letras.mus.br/hinario-adventista/anunciai-pelas-montanhas/anunciai-pelas-montanhas-print.html',
	'454': 'https://www.letras.mus.br/arautos-do-rei/1421317/a-manha-gloriosa-print.html',
	'455': 'https://www.letras.mus.br/adoradores/verei-jesus/verei-jesus-print.html',
	'457': 'https://www.letras.mus.br/arautos-do-rei/1605434/jesus-vem-logo-print.html',
	'463': 'https://www.letras.mus.br/hinario-adventista/espero-a-manha-radiosa/espero-a-manha-radiosa-print.html',
	'521': 'https://www.letras.mus.br/novo-hinario-adventista/espirito-santo/espirito-santo-print.html',
	'531': 'https://www.letras.mus.br/novo-hinario-adventista/biblia/biblia-print.html'

}

async function main() {
	for (var i = 0; i < hinos.length; i++) {

		const title = hinos[i].split(" - ")[1]

 		const number = parseInt(hinos[i].substr('Hino '.length))

 		let filename, slugTitle

		if (i === 586) {
			filename = 'songs/' + number + 'A.xml'
			slugTitle = 'chegou-a-hora-de-adorar-ao-senhor'
		} else if (i === 587) {
			filename = 'songs/' + number + 'B.xml'
			slugTitle = 'chegou-a-hora-de-adorar-ao-senhor-2'
		} else {
			filename = 'songs/' + number + '.xml'
			slugTitle = slugify(title, {
				lower: true,
				strict: true
			})
		}

		if (fs.existsSync(filename)) continue

		console.log("Getting hymn " + number + " - " + title)

		let url = exceptions[number] ? exceptions[number] : 'https://www.letras.mus.br/novo-hinario-adventista/' + slugTitle + '/' + slugTitle + '-print.html'

		let request = await fetch(url)
		let html = await request.text()
		let doc = new jsdom.JSDOM(html, { runScripts: "dangerously" })

		//console.log("Downloading hymn " + (i + 1))

		try {
			let xml = '<?xml version=\'1.0\' encoding=\'utf-8\'?>\
	<song xmlns="http://openlyrics.info/namespace/2009/song" version="0.8" createdIn="OpenLP 2.0.5" createdBy="Projeto HASDLP - https://github.com/jesobreira/hasdlp" modifiedIn="OpenLP 2.0.5" modifiedDate="2022-08-02T01:41:01">\
	  <properties>\
	  	<titles>\
	  		<title>' + number + ' - ' + title + '</title>\
		</titles>\
		<authors>'
				
			var authors = doc.window.__data.Composer.split(' / ')

			for (var j = 0; j < authors.length; j++) {
				xml += '<author>' + authors[j] + '</author>'
			}

			xml += '</authors>\
	  </properties>\
	  <lyrics>'

			var lyrics = doc.window.__data.Lyric

			let verse = 1;

			xml += '<verse name="v' + (verse++) + '"><lines><![CDATA[' + "\n"

			for (var j = 0; j < lyrics.length; j++) {
				if (!lyrics[j]) {
					xml += ']]></lines></verse>'
					xml += "\n" + '<verse name="v' + (verse++) + '"><lines><![CDATA[' + "\n"
				} else {
					xml += lyrics[j] + "\n"
				}
			}

			xml += ']]></lines></verse>\
		</lyrics>\
	</song>'

			xml = format(xml, {
				indentation: '  ',
				lineSeparator: "\r\n",
				collapseContent: true
			})

			fs.writeFileSync(filename, xml)
		} catch (e) {
			console.error('Error at ' + url)
			console.error(e)
		}
	}
}

main()
