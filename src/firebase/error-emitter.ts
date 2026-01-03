import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// This is a simple event emitter to decouple error handling from the
// component that triggers the error.
class TypedEventEmitter {
  private emitter = new EventEmitter();

  on<T extends keyof Events>(event: T, listener: Events[T]) {
    this.emitter.on(event, listener);
    return () => this.emitter.off(event, listener);
  }

  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) {
    this.emitter.emit(event, ...args);
  }
}

export const errorEmitter = new TypedEventEmitter();
