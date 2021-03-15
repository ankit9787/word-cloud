import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

declare const annyang: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  voiceActiveSectionDisabled: boolean = true;
  voiceActiveSectionError: boolean = false;
  voiceActiveSectionSuccess: boolean = false;
  voiceActiveSectionListening: boolean = false;
  voiceText: any;
  closeResult: string = '';
  user: string = "ankit";
  @ViewChild('content') openModal!:ElementRef;
  wordCloud: boolean = false;

  constructor(private ngZone: NgZone, private modalService: NgbModal) {}

	ngOnInit(): void {
	
	}

	ngAfterViewInit(): void {
		//this.open();
	}

  open() {
    const modalRef = this.modalService.open(this.openModal, {
		keyboard: false,
		backdrop: 'static'
	});
    //modalRef.componentInstance.lesson = lesson;
  }

  dismissModal(){
	  this.modalService.dismissAll();
  }

  initializeVoiceRecognitionCallback(): void {
  	annyang.addCallback('error', (err: any) => {
    if(err.error === 'network'){
      this.voiceText = "Internet is require";
      annyang.abort();
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
    } else if (this.voiceText === undefined) {
  			this.ngZone.run(() => this.voiceActiveSectionError = true);
  			annyang.abort();
  		}
  	});

  	annyang.addCallback('soundstart', () => {
    this.ngZone.run(() => this.voiceActiveSectionListening = true);
  	});

  	annyang.addCallback('end', () => {
    if (this.voiceText === undefined) {
      this.ngZone.run(() => this.voiceActiveSectionError = true);
  			annyang.abort();
  		}
  	});

  	annyang.addCallback('result', (userSaid: any) => {
  		this.ngZone.run(() => this.voiceActiveSectionError = false);

  		let queryText: any = userSaid[0];

  		annyang.abort();

    this.voiceText = queryText;

  		this.ngZone.run(() => this.voiceActiveSectionListening = false);
    this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
  	});
  }

  startVoiceRecognition(): void {
  this.voiceActiveSectionDisabled = false;
  	this.voiceActiveSectionError = false;
  	this.voiceActiveSectionSuccess = false;
  this.voiceText = undefined;

  	if (annyang) {
  		let commands = {
  			'demo-annyang': () => { }
  		};

  		annyang.addCommands(commands);

    this.initializeVoiceRecognitionCallback();

  		annyang.start({ autoRestart: false });
  	}
  }

  closeVoiceRecognition(): void {
  this.voiceActiveSectionDisabled = true;
  	this.voiceActiveSectionError = false;
  	this.voiceActiveSectionSuccess = false;
  	this.voiceActiveSectionListening = false;
  	this.voiceText = undefined;

  	if(annyang){
    annyang.abort();
  }
  }

  showWordCloud(){
	  this.wordCloud = true;
  }

}