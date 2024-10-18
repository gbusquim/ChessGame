import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { Move } from '../interfaces/move.interface'; 

@Injectable({
  providedIn: 'root'
})
export class MovesDatabaseService {
  private dbPath = '/moves';
  movesRef!: AngularFireList<Move>;

  constructor(private db: AngularFireDatabase) { 
    this.movesRef = db.list(this.dbPath);
  }

  get(gameId: string): Observable<string[]> {
    return this.db.list<string>(`${this.dbPath}/${gameId}`).valueChanges();
  }

  add(gameId: string, move: string): Promise<void> {
    return this.db.list(`${this.dbPath}/${gameId}`).push(move).then(() => {});
  }

  delete(gameId: string): Promise<void> {
    return this.movesRef.remove(gameId);
  }
}
