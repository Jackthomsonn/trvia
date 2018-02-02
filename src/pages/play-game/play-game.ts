import { IQuestion } from './../../interfaces/IQuestion';
import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular'

import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from './../../providers/header-service/header-service'

import { ToastController } from 'ionic-angular/components/toast/toast-controller'
import { Toast } from 'ionic-angular/components/toast/toast'

@IonicPage()
@Component({
  selector: 'page-play-game',
  templateUrl: 'play-game.html',
})

export class PlayGamePage {
  public possibleAnswers: any
  public answer: boolean
  public countdown: number
  public shouldShowCountdown: boolean
  public waitingForOtherPlayersMessage: string
  public shouldShowWinnerDialogue: boolean
  public playersScoreToShow: number = 0
  public didIWin: boolean

  private correctAnswer: string
  private countDownInstance
  private currentQuestion: string
  private questions: Array<IQuestion>
  private currentQuestionIndex: number
  private toastInstance: Toast

  @ViewChild(Navbar) navbar: Navbar

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private toastCtrl: ToastController) {
  }

  public answerQuestion(answer) {
    this.socketServiceProvider.emit('submitAnswer', {
      isAnswerCorrect: answer === this.correctAnswer,
      gameId: this.getGameId()
    })

    this.clearAnswer()

    this.waitingForOtherPlayersMessage = 'Waiting for other players..'
  }

  public showQuestion() {
    if (this.questionsExist()) {
      if (this.isLastQuestion() && !this.shouldShowWinnerDialogue) {
        if (this.isTheHost()) {
          this.socketServiceProvider.emit('endOfGame', {
            gameId: this.getGameId()
          })

          return
        }
      } else if (!this.isLastQuestion()) {
        this.correctAnswer = this.questions[this.currentQuestionIndex].correct_answer
        this.currentQuestion = this.questions[this.currentQuestionIndex].question.replace(/&#*|&|&quot;/, '')

        this.possibleAnswers = this.questions[this.currentQuestionIndex].incorrect_answers
        this.possibleAnswers.push(this.correctAnswer)

        this.possibleAnswers = new Set(this.possibleAnswers)
      }
    }
  }

  public countPlayersScore() {
    this.shouldShowWinnerDialogue = true

    const playersScore = 170

    const count = setInterval(() => {
      if (this.playersScoreToShow === playersScore - 1) {
        clearInterval(count)
      }
      this.playersScoreToShow++
    }, 10)
  }

  public playAnotherGame() {
    clearTimeout(this.countDownInstance)
    this.navCtrl.popToRoot()
  }

  private getGameId() {
    return this.navParams.data.gameId
  }

  private getPlayerName() {
    return this.navParams.data.playerName
  }

  private questionsExist() {
    return this.questions && this.questions.length > 0
  }

  private isTheHost() {
    return this.navParams.data.isTheHost
  }

  private isLastQuestion() {
    return this.currentQuestionIndex >= this.questions.length
  }

  private clearAnswer() {
    this.answer = !this.answer
  }

  private getCurrentQuestionCount() {
    return `${this.currentQuestionIndex + 1} / ${this.questions ? this.questions.length : 0}`
  }

  private startGameTimer() {
    this.socketServiceProvider.emit('resetAnswerCount', { gameId: this.getGameId() })

    this.countDownInstance = setTimeout(() => {
      this.currentQuestionIndex++
      this.showQuestion()
      this.headerServiceProvider.text.next(this.currentQuestion)
      this.headerServiceProvider.subText.next(this.getCurrentQuestionCount())
      this.waitingForOtherPlayersMessage = undefined

      clearTimeout(this.countDownInstance)

      this.startGameTimer()
    }, 10000)
  }

  private setupProps() {
    this.questions = this.navParams.data.questions
    this.shouldShowCountdown = false
    this.countdown = 3
    this.shouldShowCountdown = true
    this.currentQuestionIndex = 0
  }

  private setupSplashScreen() {
    const splashScreenIntervalInstance = setInterval(() => {
      this.countdown = this.countdown - 1
      if (this.countdown === 0) {
        this.showQuestion()
        this.shouldShowCountdown = false
        clearInterval(splashScreenIntervalInstance)

        this.startGameTimer()

        this.headerServiceProvider.setup({
          text: this.currentQuestion,
          subText: this.getCurrentQuestionCount(),
          showAlternativeMessage: false
        })
      }
    }, 1000)
  }

  private didPlayerWin(winner) {
    this.didIWin = winner.name === this.getPlayerName()
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('theWinner', winner => {
      this.didPlayerWin(winner);
      this.shouldShowWinnerDialogue = true
      this.countPlayersScore()
    })

    this.socketServiceProvider.on('everyoneAnswered', () => {
      this.currentQuestionIndex++
      this.showQuestion()
      this.headerServiceProvider.text.next(this.currentQuestion)
      this.headerServiceProvider.subText.next(this.getCurrentQuestionCount())
      this.waitingForOtherPlayersMessage = undefined

      clearTimeout(this.countDownInstance)

      this.startGameTimer()
    })
  }

  ionViewDidLoad() {
    this.setupSocketEventListeners()

    this.setupProps()

    this.setupSplashScreen()
  }

  ionViewDidLeave() {
    this.socketServiceProvider.emit('leaveGame', {
      gameId: this.getGameId(),
      playerName: this.getPlayerName()
    })

    this.socketServiceProvider.on('hostLeft', () => {
      if (!this.isTheHost()) {
        if (this.toastInstance) {
          return
        } else {
          this.toastInstance = this.toastCtrl.create({
            message: 'The host left the game',
            showCloseButton: true,
            duration: 5000
          })

          this.toastInstance.onDidDismiss(() => {
            this.toastInstance = undefined
          })

          this.toastInstance.present()

          this.navCtrl.popToRoot()
        }
      }
    })

    clearTimeout(this.countDownInstance)
  }
}
