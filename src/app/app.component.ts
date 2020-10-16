import { Component, OnDestroy } from "@angular/core";

import { fromEvent, merge, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";

import { AuthenticationService } from "./authentication.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnDestroy {
  closed$ = new Subject<any>();
  countDown: number;

  constructor(private authService: AuthenticationService) {}

  login() {
    this.authService
      .login()
      .pipe(
        switchMap(_ =>
          merge(
            fromEvent(document, "mouseup"), // <-- replace these with user events to reset timer
            fromEvent(document, "mousemove")
          )
        ),
        this.authService.countdownTimer(),
        takeUntil(this.closed$)
      )
      .subscribe(countDown => (this.countDown = countDown));
  }

  logout() {
    this.authService
      .logout()
      .pipe(takeUntil(this.closed$))
      .subscribe();
  }

  ngOnDestroy() {
    this.closed$.next();
  }
}
