import 'dotenv/config';

import Queue from './lib/Queue';

Queue.processQueue();

// Esse arquivo serve para não executarmos a aplicação na mesma exe que vai rodar a fila
// Assim a Fila nunca vai afetar a performance da app
