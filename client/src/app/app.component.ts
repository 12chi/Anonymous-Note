import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  newNote = {text: ""}
  notes = [];

  ngOnInit() {
    this.getAllNotes();
  }
  
  constructor (private _httpService: HttpService) {}

  getAllNotes() {
    let Obs = this._httpService.getNotes();
    Obs.subscribe(data => {
      if (data['message'] == 'Success') {
        console.log('Successfully getting notes', data);
        this.newNote.text="";
        this.notes = data['data']
        console.log(this.notes)
      } else {
        console.log('Error: Get All Notes', data['error']);
      }
    });
  }

  addNote() {
      console.log(this.newNote)
      let Obs = this._httpService.createNote(this.newNote);
      Obs.subscribe(data => {
        if (data['message'] == 'Success') {
          console.log('Successfully create note', data);
          this.newNote.text="";
        } else {
          console.log('Error: Create Note', data['error']);
        }
      });
      this.getAllNotes();
      console.log(this.notes)
    }
}
