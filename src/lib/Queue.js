import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

// Todos os jobs
const jobs = [CancellationMail];

class Queue {
  constructor() {
    // Armazena os Jobs aqui
    this.queues = {};

    this.init();
  }

  init() {
    // Criação da Fila
    jobs.forEach(({ key, handle }) => {
      // Conexão com redis
      // handle processa a fila
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  // "Queue" é qual fila eu quero adicionar o meu Job ex: "CancellationMail"
  add(queue, job) {
    // queue é a fila e job são os dados que vao ser processados
    return this.queues[queue].bee.createJob(job).save();
  }

  // Pega os jobs e processa eles
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
