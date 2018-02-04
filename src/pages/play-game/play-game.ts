import { IQuestion } from './../../interfaces/IQuestion';
import { Component, ViewChild } from '@angular/core'
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular'

import { SocketServiceProvider } from './../../providers/socket-service/socket-service'
import { HeaderServiceProvider } from './../../providers/header-service/header-service'
import { PlayerServiceProvider } from './../../providers/player-service/player-service'

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
  public playersScore: number

  private correctAnswer: string
  private countDownInstance
  private currentQuestion: string
  private questions: Array<IQuestion>
  private currentQuestionIndex: number
  private toastInstance: Toast

  private disconnectionToast: Toast

  @ViewChild(Navbar) navbar: Navbar

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private socketServiceProvider: SocketServiceProvider,
    private headerServiceProvider: HeaderServiceProvider,
    private playerServiceProvider: PlayerServiceProvider,
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
            gameId: this.getGameId(),
            playerName: this.getPlayerName()
          })

          return
        }
      } else if (!this.isLastQuestion()) {
        this.correctAnswer = this.decode(this.questions[this.currentQuestionIndex].correct_answer)
        this.currentQuestion = this.decode(this.questions[this.currentQuestionIndex].question)

        this.possibleAnswers = this.questions[this.currentQuestionIndex].incorrect_answers
        this.possibleAnswers.push(this.correctAnswer)

        this.possibleAnswers = new Set(this.shuffle(this.possibleAnswers))
      }
    }
  }

  public countPlayersScore(score: number) {
    this.shouldShowWinnerDialogue = true
    this.playersScore = score

    const playersScore = score

    const count = setInterval(() => {
      if (this.playersScoreToShow === playersScore - 1) {
        clearInterval(count)
      }
      this.playersScoreToShow++
    }, 5)

    this.playerServiceProvider.getPlayerInformation().then(player => {
      console.log('Update score')
      this.playerServiceProvider.setPlayerInformation({
        name: player.name,
        level: 0,
        points: (player.points + score)
      })
    })
  }

  public playAnotherGame() {
    clearTimeout(this.countDownInstance)
    this.navCtrl.popToRoot()
  }

  public decode(str) {
    var e = document.createElement('div');
    e.innerHTML = str;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  private shuffle(possibleAnswers) {
    for (let i = possibleAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [possibleAnswers[i], possibleAnswers[j]] = [possibleAnswers[j], possibleAnswers[i]]
    }
    return possibleAnswers
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

  private handleDisconnection = (socket) => {
    this.disconnectionToast = this.toastCtrl.create({
      message: 'Connection was lost, reconnecting..'
    })

    this.disconnectionToast.present()

    this.navCtrl.popToRoot()
  }

  private handleReconnection = (socket) => {
    this.disconnectionToast.dismiss().then(() => {
      this.toastCtrl.create({
        message: 'Reconnected successfully',
        duration: 2000
      }).present()
    })
  }

  private setupSocketEventListeners() {
    this.socketServiceProvider.on('theWinner', winner => {
      this.didPlayerWin(winner);
      this.shouldShowWinnerDialogue = true
    })

    this.socketServiceProvider.on('getPlayersScore', player => {
      this.countPlayersScore(player.score)
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

    this.socketServiceProvider.on('disconnect', this.handleDisconnection)

    this.socketServiceProvider.on('reconnect', this.handleReconnection)
  }

  ionViewDidEnter() {
    this.socketServiceProvider.socket.off('disconnect')
    this.socketServiceProvider.socket.off('reconnect')
    this.socketServiceProvider.socket.off('everyoneAnswered')

    this.setupSocketEventListeners()
  }

  ionViewDidLoad() {
    this.setupProps()

    this.setupSplashScreen()
  }

  ionViewWillUnload() {
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

      clearTimeout(this.countDownInstance)
    })

    clearTimeout(this.countDownInstance)
  }
}
