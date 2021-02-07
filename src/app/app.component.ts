import { Component, OnInit } from '@angular/core';
import * as Hammer from 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    let stage = [];
    let manager = [];
    let Pan = [];
    let Rotate = [];
    let Pinch = [];
    let Tap = [];
    let DoubleTap = [];

    for (let i = 0; i < 4; i++) {
      let s = 'stage' + i;
      stage[i] = document.getElementById(s);

      if (stage[i] !== null) {
        console.log(stage[i]);
        manager[i] = new Hammer.Manager(stage[i]);

        Pan[i] = new Hammer.Pan();
        Rotate[i] = new Hammer.Rotate();
        Pinch[i] = new Hammer.Pinch();
        Tap[i] = new Hammer.Tap({
          taps: 1
        });
        DoubleTap[i] = new Hammer.Tap({
          event: 'doubletap',
          taps: 2
        });

        Rotate[i].recognizeWith([Pan[i]]);
        Pinch[i].recognizeWith([Rotate[i], Pan[i]]);
        DoubleTap[i].recognizeWith([Tap[i]]);
        Tap[i].requireFailure([DoubleTap[i]]);

        manager[i].add(Pan[i]);
        manager[i].add(Rotate[i]);
        manager[i].add(Pinch[i]);
        manager[i].add(DoubleTap[i]);
        manager[i].add(Tap[i]);

        //E-MOVE//
        this.eventMove(manager[i], stage[i]);
        //E-ROTATE//
        this.eventRotate(manager[i], stage[i]);
        //E-SCALE//
        this.eventScale(manager[i], stage[i]);
      }
    }

    ///////////////////////////////////////////
  }

  eventMove(manager:any, stage:any): void {
    var deltaX = 0;
    var deltaY = 0;
    manager.on('panmove', (e: any) => {
      var dX = deltaX + (e.deltaX);
      var dY = deltaY + (e.deltaY);
      var r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      var s = stage.style.transform.match(/scale\((.*)\)/g);
      stage.style.transform = 'translate('+dX+'px, '+dY+'px) '+r+' '+s+'';
    });
    manager.on('panend', (e: any) => {
      deltaX = deltaX + e.deltaX;
      deltaY = deltaY + e.deltaY;
    });
  }

  eventRotate(manager:any, stage:any): void {
    var liveScale = 1;
    var currentRotation = 0;
    manager.on('rotatemove', (e: any) => {
        var rotation = currentRotation + Math.round(liveScale * e.rotation);
        var t = stage.style.transform.match(/translate\((.*px,.*px)\)/g);
        var s = stage.style.transform.match(/scale\((.*)\)/g);
        stage.style.transform = ''+t+' rotateZ('+rotation+'deg) '+s+'';
    });
    manager.on('rotateend', (e: any) => {
        currentRotation += Math.round(e.rotation);
    });
  }

  eventScale(manager:any, stage:any): void {
    var liveScale = 1;
    var currentScale = 1;
    manager.on('pinchmove', (e: any) => {
      var scale = e.scale * currentScale;
      var t = stage.style.transform.match(/translate\((.*px,.*px)\)/g);
      var r = stage.style.transform.match(/rotateZ\((.*deg)\)/g);
      stage.style.transform = ''+t+' '+r+' scale('+scale+')';
    });
    manager.on('pinchend', (e: any) => {
      currentScale = e.scale * currentScale;
      liveScale = currentScale;
    });
  }
}
