import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  getNotes(){
    console.log('Getting All Notes')
    return this._http.get('/notes');
  }

  getOneNote(id) {
    console.log("Getting note details");
    let pStr = "/notes/" + id
    console.log("str: ", pStr)
    return this._http.get(pStr);
    // tmpObs.subscribe(data => console.log('Got one task', data));   
  }

  createNote(newNote) {
    return this._http.post('/notes', newNote)
  }

}
