import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-main-structure',
  standalone: false,
  
  templateUrl: './main-structure.component.html',
  styleUrl: './main-structure.component.scss'
})
export class MainStructureComponent {

  public subjectIsOpenMenu = new BehaviorSubject<boolean>(true);
  public hasOpenOrClose: boolean = true;

  ngOnInit(){
    this.subjectIsOpenMenu.subscribe({
      next: (value) => {
        console.log(value)
        this.hasOpenOrClose = value
      } 
    });
  }

}
