import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Chess } from 'chess.js'
import { courseSections, lessons, ruleCards, sources } from './content.js'
import { calculateStreak, calculateXp, localDateKey, normalizeProgress, rankProgress } from './progress.js'
import { isLightSquare } from './boardUtils.js'
import { explainAstraMove, explainHint, explainPlayerMove } from './coach.js'
import './styles.css'

const GLYPHS = { wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔', bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚' }
const PIECE_NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }
const files = ['a','b','c','d','e','f','g','h']

const ASTRA_ART = {
  hero: './assets/astra-hero.jpg',
  welcome: './assets/astra-welcome.jpg',
  tactics: './assets/astra-tactics.jpg',
  challenge: './assets/astra-challenge.jpg',
}

const ASTRA_GUIDANCE = {
  foundations: { variant: 'welcome', line: 'I’ll make the goal and the rules visible before asking you to remember them.' },
  pieces: { variant: 'welcome', line: 'Learn each piece’s promise—and its limitation. Confidence starts with legal moves.' },
  special: { variant: 'welcome', line: 'The unusual rules become simple when we track exactly when they apply.' },
  opening: { variant: 'welcome', line: 'I’ll give you a compass, not a script. You should understand your opening moves.' },
  tactics: { variant: 'tactics', line: 'Pause and look at what changed. Patterns appear when you scan forcing moves.' },
  middlegame: { variant: 'tactics', line: 'I’ll help you compare plans, but the final choice—and the reason—should be yours.' },
  endgame: { variant: 'challenge', line: 'With fewer pieces, every square matters. We’ll slow down and count together.' },
  mastery: { variant: 'challenge', line: 'My job is to make you need me less. Explain the move in your own words.' },
}

function AstraAvatar({ className = '', variant = 'hero' }) {
  return <span className={`astra-avatar astra-${variant} ${className}`} aria-hidden="true"><img src={ASTRA_ART[variant]} alt="" /></span>
}

function Board({ game, onMove, disabled = false, orientation = 'w', hintSquare, lastMove }) {
  const [selected, setSelected] = useState(null)
  const [promotion, setPromotion] = useState(null)
  const [focusSquare, setFocusSquare] = useState(() => game.board().flat().find(piece => piece?.color === game.turn())?.square || 'a1')
  const squareRefs = useRef({})
  const promotionRef = useRef(null)
  const returnFocusRef = useRef(null)
  const [, rerender] = useState(0)
  const legal = selected ? game.moves({ square: selected, verbose: true }) : []
  const ranks = orientation === 'w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8]
  const shownFiles = orientation === 'w' ? files : [...files].reverse()

  useEffect(() => {
    setSelected(null)
    setPromotion(null)
    setFocusSquare(game.board().flat().find(piece => piece?.color === game.turn())?.square || 'a1')
  }, [game, orientation])

  const commitMove = (from, to, chosenPromotion) => {
    const move = game.move({ from, to, ...(chosenPromotion ? { promotion: chosenPromotion } : {}) })
    setSelected(null)
    setPromotion(null)
    setFocusSquare(to)
    rerender(x => x + 1)
    onMove?.(move)
    requestAnimationFrame(() => squareRefs.current[to]?.focus())
  }

  const closePromotion = () => {
    setPromotion(null)
    requestAnimationFrame(() => returnFocusRef.current?.focus())
  }

  const pick = (square) => {
    if (disabled || promotion) return
    const piece = game.get(square)
    const targets = legal.filter(move => move.to === square)
    if (selected && targets.length) {
      if (targets.some(move => move.promotion)) {
        returnFocusRef.current = squareRefs.current[square]
        setPromotion({ from: selected, to: square, color: game.turn() })
      }
      else commitMove(selected, square)
    } else if (piece && piece.color === game.turn()) {
      setSelected(square); rerender(x => x + 1)
    } else setSelected(null)
  }

  const moveFocus = (square, key) => {
    const row = ranks.indexOf(Number(square[1]))
    const col = shownFiles.indexOf(square[0])
    const offsets = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] }
    const [dr, dc] = offsets[key]
    const nextRow = Math.max(0, Math.min(7, row + dr))
    const nextCol = Math.max(0, Math.min(7, col + dc))
    const next = `${shownFiles[nextCol]}${ranks[nextRow]}`
    setFocusSquare(next)
    squareRefs.current[next]?.focus()
  }

  const keyDown = (event, square) => {
    if (disabled || promotion) return
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)) {
      event.preventDefault(); moveFocus(square, event.key)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); pick(square)
    }
  }

  const promotionKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closePromotion()
      return
    }
    if (event.key !== 'Tab') return
    const controls = [...promotionRef.current.querySelectorAll('button:not(:disabled)')]
    const first = controls[0]
    const last = controls.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }

  return <div className="board-wrap">
    <div className="board" role="grid" aria-label="Interactive chessboard">
      {ranks.flatMap((rank, row) => shownFiles.map((file, col) => {
        const square = `${file}${rank}`
        const piece = game.get(square)
        const moves = legal.filter(move => move.to === square)
        const isLegal = moves.length > 0
        const isCapture = moves.some(move => move.captured)
        const isLight = isLightSquare(square)
        const classes = ['square', isLight ? 'light' : 'dark', selected === square ? 'selected' : '', isLegal ? 'legal' : '', isCapture ? 'capture' : '', hintSquare === square ? 'hint' : '', lastMove?.includes(square) ? 'last' : ''].filter(Boolean).join(' ')
        const label = `${square}, ${piece ? `${piece.color === 'w' ? 'white' : 'black'} ${PIECE_NAMES[piece.type]}` : 'empty'}${isLegal ? isCapture ? ', legal capture' : ', legal move' : ''}`
        return <button key={square} ref={node => { squareRefs.current[square] = node }} data-square={square} disabled={disabled || Boolean(promotion)} aria-disabled={disabled || Boolean(promotion)} tabIndex={focusSquare === square ? 0 : -1} className={classes} onClick={() => pick(square)} onKeyDown={event => keyDown(event, square)} role="gridcell" aria-label={label} aria-selected={selected === square}>
          {piece && <span className={`piece ${piece.color}`}>{GLYPHS[piece.color + piece.type]}</span>}
          {row === 7 && <span className="coord file">{file}</span>}
          {col === 0 && <span className="coord rank">{rank}</span>}
        </button>
      }))}
    </div>
    {promotion && <div ref={promotionRef} className="promotion-dialog" role="dialog" aria-modal="true" aria-label="Choose a promotion piece" onKeyDown={promotionKeyDown}>
      <p>Promote your pawn to:</p>
      <div>{['q','r','b','n'].map(type => <button key={type} autoFocus={type === 'q'} onClick={() => commitMove(promotion.from, promotion.to, type)} aria-label={`Promote to ${PIECE_NAMES[type]}`}><span className={`piece ${promotion.color}`}>{GLYPHS[promotion.color + type]}</span><small>{PIECE_NAMES[type]}</small></button>)}</div>
      <button className="promotion-cancel" onClick={closePromotion}>Cancel</button>
    </div>}
  </div>
}

function Topbar({ view, setView, xp }) {
  const nav = [['home','Home'],['learn','Learn'],['play','Play'],['rules','Rulebook']]
  return <header className="topbar">
    <button className="brand" onClick={() => setView('home')}><span className="brand-mark">♞</span><span>Astral <b>Chess</b></span></button>
    <nav aria-label="Primary navigation">{nav.map(([id,label]) => <button key={id} className={view === id ? 'active' : ''} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}>{label}</button>)}</nav>
    <div className="xp-pill"><span>✦</span> {xp} XP</div>
  </header>
}

function Home({ setView, completed, xp, activity }) {
  const next = lessons.find(lesson => !completed.includes(lesson.id)) || null
  const courseComplete = completed.length === lessons.length
  const completionPercent = Math.round((completed.length / lessons.length) * 100)
  const rank = rankProgress(xp)
  const streak = calculateStreak(activity)
  const featured = next || { icon: '♕', chapter: 'Complete', title: 'Core path complete', summary: 'You built a complete foundation from legal moves through tactics, strategy, endgames, and independent practice.' }
  return <main>
    <section className="hero">
      <img src="./assets/astra-hero.jpg" alt="Astra, the original anime-inspired chess mentor, holding a glowing knight" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-copy">
        <div className="kicker"><span /> Your chess story begins</div>
        <h1>Every move<br/>reveals a <em>world.</em></h1>
        <p>Learn international chess from zero, one small quest at a time. Astra is your navigator: he explains why moves work, helps you build a thinking routine, then challenges you to choose independently.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setView(courseComplete ? 'play' : `lesson:${featured.id}`)}>{completed.length ? courseComplete ? 'Play your next game' : 'Continue your journey' : 'Begin chapter one'} <span>→</span></button>
          <button className="ghost" onClick={() => setView('play')}><span>▶</span> Play Astra</button>
        </div>
        <div className="hero-trust"><span>✓</span> Based on official FIDE Laws of Chess</div>
      </div>
    </section>
    <section className="dashboard section-shell">
      <div className="section-heading"><div><span className="overline">Your path</span><h2>Continue your training</h2></div><button className="text-button" onClick={() => setView('learn')}>View all lessons →</button></div>
      <div className="dash-grid">
        <article className={`continue-card ${courseComplete ? 'course-complete' : ''}`}>
          <div className="lesson-art"><span>{featured.icon}</span><div className="orbit orbit-a"/><div className="orbit orbit-b"/></div>
          <div className="continue-copy"><span className="chapter">{courseComplete ? 'Journey complete' : `Chapter ${featured.chapter}`}</span><h3>{featured.title}</h3><p>{featured.summary}</p><div className="progress-line"><div className="progress-track" role="progressbar" aria-label="Course completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={completionPercent}><i style={{width: `${completionPercent}%`}}/></div><span>{completionPercent}% complete</span></div><button className="primary small" onClick={() => setView(courseComplete ? 'play' : `lesson:${featured.id}`)}>{courseComplete ? 'Put it into practice →' : 'Continue lesson →'}</button></div>
        </article>
        <aside className="profile-card"><div className="rank-orb">{rank.current.symbol}<span>{rank.index + 1}</span></div><span className="overline">Current rank</span><h3>{rank.current.name}</h3><p>{rank.next ? `${rank.next.minXp - xp} XP until ${rank.next.name}` : 'Highest academy rank reached'}</p><div className="rank-progress" role="progressbar" aria-label={rank.next ? `Progress to ${rank.next.name}` : 'Highest rank reached'} aria-valuemin="0" aria-valuemax="100" aria-valuenow={rank.percent}><i style={{width: `${rank.percent}%`}} /></div><div className="stats"><div><b>{completed.length}/{lessons.length}</b><span>Lessons</span></div><div><b>{xp}</b><span>Total XP</span></div><div><b>{streak}</b><span>Day streak</span></div></div></aside>
      </div>
    </section>
    <section className="why section-shell"><div className="section-heading"><div><span className="overline">Built for beginners</span><h2>Not a rulebook. An adventure.</h2></div></div><div className="feature-grid">
      <article><span className="feature-icon violet">✦</span><h3>Learn by doing</h3><p>Every concept becomes a tiny board quest with instant, friendly feedback.</p></article>
      <article><span className="feature-icon blue">♞</span><h3>Rules you can trust</h3><p>Lessons separate official FIDE rules from useful strategy and common convention.</p></article>
      <article><span className="feature-icon rose">⚔</span><h3>Battle when ready</h3><p>A legal-move bot grows from gentle randomness to tactical calculation.</p></article>
    </div></section>
  </main>
}

function Learn({ completed, setView }) {
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState('all')
  const recommended = lessons.find(lesson => !completed.includes(lesson.id))?.id
  const needle = query.trim().toLowerCase()
  const visibleSections = courseSections.filter(section => activeSection === 'all' || section.id === activeSection).map(section => ({
    ...section,
    lessons: lessons.filter(lesson => lesson.section === section.id && (!needle || `${lesson.title} ${lesson.summary} ${lesson.takeaways.join(' ')} ${lesson.guide.map(item => `${item.title} ${item.text}`).join(' ')}`.toLowerCase().includes(needle))),
  })).filter(section => section.lessons.length)
  return <main className="page section-shell learn-page"><div className="page-title"><span className="overline">The starlit curriculum</span><h1>Learn chess as a complete skill</h1><p>{lessons.length} focused lessons in {courseSections.length} sections. Follow the path, or jump directly to the topic you need.</p>
      <label className="course-search"><span>Find a lesson or concept</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “castling”, “forks”, or “how to start”…" /></label>
    </div>
    <section className="astra-story" aria-labelledby="meet-astra"><header><span className="overline">Your academy navigator</span><h2 id="meet-astra">Meet Astra—the mentor who teaches himself out of a job.</h2><p>Astra does not choose moves for you. He reveals the questions strong players ask, gives you a safe place to practise, and gradually hands the board back to you.</p></header>
      <div className="astra-story-grid">
        <article><img src={ASTRA_ART.welcome} alt="Astra welcoming a new learner across a celestial chessboard" loading="lazy"/><div><span>Act I · Begin</span><h3>He lights the first square.</h3><p>Rules become visible, mistakes are reversible, and every new idea gets a focused board.</p></div></article>
        <article><img src={ASTRA_ART.tactics} alt="Astra demonstrating a knight fork as a glowing pattern" loading="lazy"/><div><span>Act II · See</span><h3>He trains your vision.</h3><p>Astra models the threat scan and thinking routine behind tactics and plans.</p></div></article>
        <article><img src={ASTRA_ART.challenge} alt="Astra offering a friendly chess challenge across the board" loading="lazy"/><div><span>Act III · Choose</span><h3>Then he becomes your opponent.</h3><p>Hints fade into questions until you can explain—and trust—your own decisions.</p></div></article>
      </div><button className="primary small" onClick={() => setView(`lesson:${recommended || lessons[0].id}`)}>{recommended ? 'Continue with Astra →' : 'Revisit the journey →'}</button>
    </section>
    <nav className="course-nav" aria-label="Course sections"><button className={activeSection === 'all' ? 'active' : ''} onClick={() => setActiveSection('all')}>All sections</button>{courseSections.map(section => <button key={section.id} className={activeSection === section.id ? 'active' : ''} onClick={() => setActiveSection(section.id)}><span>{section.number}</span>{section.title}</button>)}</nav>
    <div className="course-summary"><div><b>{completed.length}</b><span>lessons complete</span></div><div><b>{Math.round(completed.length / lessons.length * 100)}%</b><span>course progress</span></div><div><b>{lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)}</b><span>guided minutes</span></div></div>
    <div className="course-sections">{visibleSections.map(section => {
      const sectionLessons = lessons.filter(lesson => lesson.section === section.id)
      const done = sectionLessons.filter(lesson => completed.includes(lesson.id)).length
      return <section className="course-section" key={section.id} id={`section-${section.id}`}><header><div className={`section-orb ${section.color}`}>{section.icon}</div><div><span>Section {section.number}</span><h2>{section.title}</h2><p>{section.description}</p><small className="section-prereq">Builds on: {section.buildsOn}</small></div><div className="section-meter"><b>{done}/{sectionLessons.length}</b><span>complete</span><i><em style={{ width: `${done / sectionLessons.length * 100}%` }}/></i></div></header>
        <div className="lesson-grid">{section.lessons.map(l => <button className={`lesson-card ${completed.includes(l.id) ? 'done' : ''} ${recommended === l.id ? 'recommended' : ''}`} key={l.id} onClick={() => setView(`lesson:${l.id}`)}>
          <div className={`lesson-icon ${l.color}`}>{l.icon}</div><div className="lesson-number">{l.chapter}</div><span>{l.eyebrow}</span><h3>{l.title}</h3><p>{l.summary}</p><footer><span>{l.minutes} min · +{l.xp} XP</span><b>{completed.includes(l.id) ? '✓ Complete' : 'Begin →'}</b></footer>
          {recommended === l.id && <em className="recommended-badge">Recommended next</em>}
        </button>)}</div>
      </section>
    })}</div>
    {!visibleSections.length && <div className="empty-course"><b>No lesson matched “{query}”.</b><p>Try a broader term such as king, pawn, opening, tactic, or endgame.</p></div>}
  </main>
}

function Lesson({ lesson, complete, completed, setView, isComplete }) {
  const game = useMemo(() => new Chess(lesson.fen), [lesson])
  const [, refresh] = useState(0)
  const [result, setResult] = useState(isComplete ? 'replay' : 'ready')
  const [lastMove, setLastMove] = useState(null)
  const [checkpointChoice, setCheckpointChoice] = useState(null)
  const doMove = (move) => {
    setLastMove([move.from, move.to])
    const correct = Object.entries(lesson.expected).every(([key, value]) => move[key] === value)
    if (correct) setResult('checkpoint')
    else { game.undo(); setResult('try') }
    refresh(x => x + 1)
  }
  const answerCheckpoint = index => {
    setCheckpointChoice(index)
    if (index !== lesson.checkpoint.answer) return
    const replaying = isComplete
    setResult(replaying ? 'complete-replay' : 'complete')
    if (!replaying) complete(lesson.id)
  }
  const reset = () => { while (game.undo()) {} ; game.load(lesson.fen); setResult(isComplete ? 'replay' : 'ready'); setLastMove(null); setCheckpointChoice(null); refresh(x => x + 1) }
  const idx = lessons.findIndex(l => l.id === lesson.id)
  const next = lessons[idx + 1]
  const section = courseSections.find(item => item.id === lesson.section)
  const sectionLessons = lessons.filter(item => item.section === lesson.section)
  const sectionIndex = sectionLessons.findIndex(item => item.id === lesson.id)
  const astra = ASTRA_GUIDANCE[lesson.section]
  const completedNow = result === 'complete' || result === 'complete-replay'
  const feedback = result === 'complete'
    ? ['✦', 'Quest complete!', `${lesson.checkpoint.explanation} You earned ${lesson.xp} XP.`]
    : result === 'complete-replay'
      ? ['✓', 'Replay cleared!', `${lesson.checkpoint.explanation} Your original XP is already safe.`]
      : result === 'checkpoint'
        ? ['?', 'Board move solved!', 'One quick rule check will finish the quest.']
        : result === 'try'
          ? ['↻', 'Good experiment—try once more.', `You played ${lastMove ? `${lastMove[0]}–${lastMove[1]}` : 'a different move'}. Astra restored the position, so you can try the named piece immediately.`]
          : result === 'replay'
            ? ['↺', 'Practice replay', 'Solve the board and rule check again. Replays do not award duplicate XP.']
            : ['♞', 'Choose a piece to reveal its legal moves.', 'Dots mark destinations; rings mark captures.']
  const coursePercent = Math.round((completed.length / lessons.length) * 100)
  return <main className="page section-shell lesson-page"><div className="lesson-utility"><button className="back" onClick={() => setView('learn')}>← Course map</button><div><span>Lesson {idx + 1} of {lessons.length}</span><div className="lesson-progress" role="progressbar" aria-label="Course completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow={coursePercent}><i style={{ width: `${coursePercent}%` }}/></div></div></div>
    <div className="lesson-context"><span>Section {section.number}</span><b>{section.title}</b><em>{sectionIndex + 1} of {sectionLessons.length}</em></div>
    <div className="lesson-layout"><section className="lesson-instruction"><span className="chapter">Lesson {lesson.chapter} · {lesson.eyebrow}</span><h1>{lesson.title}</h1><p className="lead">{lesson.summary}</p><div className="lesson-goals"><span>YOU WILL LEARN</span><ul>{lesson.takeaways.map(item => <li key={item}>{item}</li>)}</ul></div>
      <div className="mentor-note"><AstraAvatar variant={astra.variant}/><div><b>Astra · your navigator</b><p>{astra.line}</p><p className="mentor-rule">{lesson.rule}</p></div></div>
      <div className="lesson-guide"><span className="guide-label">STEP-BY-STEP GUIDE</span>{lesson.guide.map((item, index) => <article key={item.title}><i>{String(index + 1).padStart(2, '0')}</i><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</div>
      <div className="quest"><span>YOUR QUEST</span><p>{lesson.prompt}</p></div>
      <div className="tip"><span>✦</span><p><b>Look out:</b> {lesson.tip}</p></div>
    </section><section className="lesson-board-card"><div className="board-header"><div><span>Practice board</span><b>{game.turn() === 'w' ? 'White' : 'Black'} to move</b></div><button onClick={reset}>↻ Reset</button></div><p className="position-note">{lesson.positionNote || 'This focused practice position removes unrelated pieces so the target idea is easier to see.'}</p><Board game={game} onMove={doMove} disabled={!['ready', 'replay', 'try'].includes(result)} lastMove={lastMove}/>
      {result === 'checkpoint' && <fieldset className="checkpoint"><legend>Rule check · 2 of 2</legend><p>{lesson.checkpoint.question}</p><div>{lesson.checkpoint.options.map((option, index) => <button key={option} className={checkpointChoice === index ? index === lesson.checkpoint.answer ? 'correct' : 'incorrect' : ''} onClick={() => answerCheckpoint(index)} aria-pressed={checkpointChoice === index}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{checkpointChoice !== null && checkpointChoice !== lesson.checkpoint.answer && <small role="alert">Not quite. Re-read Astra’s rule and try another answer.</small>}</fieldset>}
      <div className={`feedback ${result}`} aria-live="polite"><span>{feedback[0]}</span><div><b>{feedback[1]}</b><p>{feedback[2]}</p></div>{completedNow && <button className="primary small" onClick={() => setView(next ? `lesson:${next.id}` : 'play')}>{next ? 'Next lesson →' : 'Play a game →'}</button>}</div>
    </section></div>
  </main>
}

function Play() {
  const gameRef = useRef(new Chess())
  const botTimerRef = useRef(null)
  const botWorkerRef = useRef(null)
  const botReplyRef = useRef(null)
  const botRequestRef = useRef(0)
  const playerCoachRef = useRef('')
  const game = gameRef.current
  const [, refresh] = useState(0)
  const [level, setLevel] = useState(0)
  const [thinking, setThinking] = useState(false)
  const [hinting, setHinting] = useState(false)
  const [hintSquare, setHintSquare] = useState(null)
  const [lastMove, setLastMove] = useState(null)
  const [claimedDraw, setClaimedDraw] = useState('')
  const [message, setMessage] = useState('You are White. Make the first move.')
  const [coach, setCoach] = useState('Start with a centre pawn or develop a knight. I’ll explain what changes after every turn.')
  const history = game.history()

  useEffect(() => {
    const worker = new Worker(new URL('./botWorker.js', import.meta.url), { type: 'module' })
    worker.onmessage = event => botReplyRef.current?.(event.data)
    worker.onerror = () => botReplyRef.current?.({ id: botRequestRef.current, error: 'Bot worker failed.' })
    botWorkerRef.current = worker
    return () => { window.clearTimeout(botTimerRef.current); worker.terminate() }
  }, [])

  const positionRepetitions = () => {
    const replay = new Chess()
    const counts = new Map()
    const remember = () => {
      const key = replay.fen().split(' ').slice(0, 4).join(' ')
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    remember()
    for (const move of game.history({ verbose: true })) {
      replay.move({ from: move.from, to: move.to, ...(move.promotion ? { promotion: move.promotion } : {}) })
      remember()
    }
    const current = game.fen().split(' ').slice(0, 4).join(' ')
    return counts.get(current) || 1
  }
  const halfMoves = () => Number(game.fen().split(' ')[4])
  const claimableDraw = () => positionRepetitions() >= 3 || halfMoves() >= 100
  const automaticResult = () => {
    if (game.isCheckmate()) return `${game.turn() === 'w' ? 'Black' : 'White'} wins by checkmate.`
    if (game.isStalemate()) return 'Draw by stalemate.'
    if (game.isInsufficientMaterial()) return 'Draw: neither side can produce checkmate.'
    if (positionRepetitions() >= 5) return 'Draw by fivefold repetition.'
    if (halfMoves() >= 150) return 'Draw by the 75-move rule.'
    return ''
  }
  const boardStatus = () => automaticResult() || (claimableDraw() ? `${game.turn() === 'w' ? 'White' : 'Black'} may claim a draw.` : game.inCheck() ? `${game.turn() === 'w' ? 'White' : 'Black'} is in check.` : `${game.turn() === 'w' ? 'White' : 'Black'} to move.`)
  const gameResult = () => claimedDraw || automaticResult()
  const status = () => claimedDraw || boardStatus()
  const cancelBot = () => {
    window.clearTimeout(botTimerRef.current)
    botTimerRef.current = null
    botReplyRef.current = null
    botRequestRef.current += 1
    setThinking(false)
    setHinting(false)
  }
  const botTurn = () => {
    if (automaticResult()) { setMessage(status()); return }
    if (claimableDraw()) {
      const reason = positionRepetitions() >= 3 ? 'Astra claimed a draw by threefold repetition.' : 'Astra claimed a draw under the 50-move rule.'
      setClaimedDraw(reason); setMessage(reason); return
    }
    setThinking(true); setMessage('Astra is reading the board…')
    botTimerRef.current = window.setTimeout(() => {
      const id = ++botRequestRef.current
      botReplyRef.current = response => {
        if (response.id !== id) return
        botReplyRef.current = null
        let played = null
        if (response.move && game.turn() === 'b' && !gameResult()) {
          played = game.move(response.move)
          setLastMove([played.from, played.to])
        }
        botTimerRef.current = null
        setThinking(false)
        setMessage(response.error ? 'Astra lost the thread. Try a new game.' : status())
        setCoach(response.error ? 'I could not calculate that reply. Start a new game and we can try again.' : `${playerCoachRef.current} ${explainAstraMove(played)}`)
        refresh(x => x + 1)
      }
      botWorkerRef.current?.postMessage({ id, fen: game.fen(), level })
    }, 420)
  }
  const move = (played) => {
    const explanation = explainPlayerMove(played)
    playerCoachRef.current = explanation
    setCoach(`${explanation} Astra is considering a reply…`)
    setHintSquare(null)
    setLastMove([played.from, played.to]); setMessage(status()); refresh(x => x + 1)
    if (!automaticResult()) botTurn()
  }
  const reset = () => { cancelBot(); game.reset(); setClaimedDraw(''); setHintSquare(null); setLastMove(null); setMessage('You are White. Make the first move.'); setCoach('Start with a centre pawn or develop a knight. I’ll explain what changes after every turn.'); refresh(x => x + 1) }
  const undo = () => { if (thinking || hinting) return; setClaimedDraw(''); game.undo(); game.undo(); setHintSquare(null); setLastMove(null); setMessage(boardStatus()); setCoach('Position restored. Compare a different move with your previous idea.'); refresh(x => x + 1) }
  const requestHint = () => {
    if (thinking || hinting || game.turn() !== 'w' || gameResult()) return
    setHinting(true)
    setCoach('Astra is finding a beginner-friendly candidate…')
    const id = ++botRequestRef.current
    botReplyRef.current = response => {
      if (response.id !== id) return
      botReplyRef.current = null
      setHinting(false)
      if (response.error || !response.move) { setCoach('I could not find a hint in this position. Check your legal moves.'); return }
      const preview = new Chess(game.fen()).move(response.move)
      setHintSquare(preview.to)
      setCoach(explainHint(preview))
    }
    botWorkerRef.current?.postMessage({ id, fen: game.fen(), level: 1 })
  }
  const claimDraw = () => {
    if (!claimableDraw() || game.turn() !== 'w') return
    const reason = positionRepetitions() >= 3 ? 'You claimed a draw by threefold repetition.' : 'You claimed a draw under the 50-move rule.'
    setClaimedDraw(reason); setMessage(reason)
  }
  return <main className="page section-shell play-page"><div className="page-title compact"><span className="overline">Training match · Act III</span><h1>Challenge Astra</h1><p>The navigator is now your opponent. Use the questions he taught you; hints remain available when you need one.</p></div>
    <div className="play-layout"><section className="play-board"><div className="opponent"><AstraAvatar className="mini-avatar" variant="challenge"/><div><b>Astra</b><span>{['Dreaming','Focused','Calculating'][level]} bot · your final training partner</span></div><div className="bot-status">{thinking ? <i/> : '♞'}</div></div><Board game={game} onMove={move} disabled={thinking || hinting || game.turn() === 'b' || Boolean(gameResult())} hintSquare={hintSquare} lastMove={lastMove}/><div className="player-row"><div className="player-avatar">Y</div><div><b>You</b><span>White</span></div></div></section>
      <aside className="game-panel"><div className="difficulty"><span>BOT LEVEL · GENTLE IS BEST FOR A FIRST GAME</span><div>{['Gentle','Clever','Sharp'].map((name,i) => <button key={name} className={level === i ? 'active' : ''} aria-pressed={level === i} onClick={() => {setLevel(i); reset()}}>{name}</button>)}</div></div><div className="game-status" aria-live="polite"><span>{thinking || hinting ? '···' : game.inCheck() ? '!' : '✦'}</span><p>{message}</p></div><div className="coach-card" aria-live="polite"><AstraAvatar variant="tactics"/><div><b>Astra’s compass</b><p>{coach}</p></div></div>{claimableDraw() && game.turn() === 'w' && !gameResult() && <button className="claim-draw" onClick={claimDraw}>Claim available draw</button>}<div className="move-list"><span>MOVE LOG</span><div>{history.length ? Array.from({length: Math.ceil(history.length/2)},(_,i) => <p key={i}><b>{i+1}.</b><span>{history[i*2]}</span><span>{history[i*2+1] || '…'}</span></p>) : <em>Your story is waiting for its first move.</em>}</div></div><div className="game-actions"><button onClick={requestHint} disabled={thinking || hinting || game.turn() !== 'w' || Boolean(gameResult())}>✦ Hint</button><button onClick={undo} disabled={history.length < 2 || thinking || hinting}>↶ Take back</button><button onClick={reset}>↻ New game</button></div></aside>
    </div>
  </main>
}

function Rules({ setView }) {
  const [query, setQuery] = useState('')
  const filtered = ruleCards.filter(rule => `${rule.title} ${rule.text}`.toLowerCase().includes(query.trim().toLowerCase()))
  return <main className="page section-shell"><div className="page-title"><span className="overline">FIDE-aware field guide</span><h1>Rules for the board—and the room</h1><p>Plain-language summaries for learning. In an event, its regulations and the arbiter govern.</p><label className="rule-search"><span>Search the field guide</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “clock”, “draw”, or “touch”…" /></label></div><div className="rules-grid">{filtered.map((r,i) => <article key={r.title}><span>{String(ruleCards.indexOf(r)+1).padStart(2,'0')}</span><h3>{r.title}</h3><p>{r.text}</p><button aria-label={`Practice ${r.title}`} onClick={() => setView(`lesson:${r.practice}`)}>Practice this rule →</button></article>)}</div>{!filtered.length && <div className="empty-rules"><b>No matching rule yet.</b><p>Try a broader word, or browse the verified sources below.</p></div>}
    <section className="special-rules"><div><span className="overline">Three famous exceptions</span><h2>Castle. Promote. En passant.</h2><p><b>Castling:</b> the king moves two squares toward the rook; the rook moves to the square the king crossed. Neither has moved; path clear; king not in check and does not cross or land on an attacked square. <button onClick={() => setView('lesson:special')}>Practice castling →</button></p><p><b>Promotion:</b> on reaching the farthest rank, a pawn must immediately become a queen, rook, bishop, or knight of its colour—even a piece already on the board. <button onClick={() => setView('lesson:promotion')}>Practice promotion →</button></p><p><b>En passant:</b> an adjacent pawn may capture a pawn that has just advanced two squares as though it moved one. The chance lasts for that reply only. <button onClick={() => setView('lesson:enpassant')}>Practice en passant →</button></p></div><div className="rule-visual"><span>♔</span><i>→</i><span>♜</span><small>One move. Two pieces.</small></div></section>
    <section className="sources"><span className="overline">Verified sources</span><h2>Where these rules come from</h2><p>Official-rule claims are grounded in FIDE’s published Laws. The learning sequence and practice topics were cross-checked against established beginner curricula; strategy is labelled separately from law.</p><div>{sources.map(s => <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.label}<span>↗</span></a>)}</div><small>Last curriculum and rule review: 19 July 2026. FIDE’s currently published Laws page states this edition took effect 1 January 2023.</small></section>
  </main>
}

function readProgress() {
  try {
    const stored = JSON.parse(localStorage.getItem('astral-progress'))
    return normalizeProgress(stored, lessons)
  } catch { return normalizeProgress(null, lessons) }
}

function App() {
  const [view, setView] = useState(() => location.hash.slice(1) || 'home')
  const [progress, setProgress] = useState(readProgress)
  const xp = calculateXp(progress.completed, lessons)
  useEffect(() => {
    const previous = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { history.scrollRestoration = previous }
  }, [])
  useLayoutEffect(() => {
    if (location.hash.slice(1) !== view) location.hash = view
    window.scrollTo(0, 0)
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [view])
  useEffect(() => { const onHash = () => setView(location.hash.slice(1) || 'home'); addEventListener('hashchange', onHash); return () => removeEventListener('hashchange', onHash) }, [])
  useEffect(() => {
    try { localStorage.setItem('astral-progress', JSON.stringify(progress)) } catch { /* Progress remains available for this session. */ }
  }, [progress])
  const complete = id => setProgress(p => {
    if (p.completed.includes(id)) return p
    const today = localDateKey()
    return { ...p, completed: [...p.completed,id], activity: p.activity.includes(today) ? p.activity : [...p.activity, today] }
  })
  let body
  if (view === 'home') body = <Home setView={setView} completed={progress.completed} xp={xp} activity={progress.activity}/>
  else if (view === 'learn') body = <Learn completed={progress.completed} setView={setView}/>
  else if (view === 'play') body = <Play/>
  else if (view === 'rules') body = <Rules setView={setView}/>
  else if (view.startsWith('lesson:')) {
    const lesson = lessons.find(l => l.id === view.split(':')[1]) || lessons[0]
    body = <Lesson key={lesson.id} lesson={lesson} complete={complete} completed={progress.completed} setView={setView} isComplete={progress.completed.includes(lesson.id)}/>
  } else body = <Home setView={setView} completed={progress.completed} xp={xp} activity={progress.activity}/>
  return <><Topbar view={view.split(':')[0]} setView={setView} xp={xp}/>{body}<footer className="site-footer"><span className="brand-mark">♞</span><p>Astral Chess Academy · Learn boldly. Play kindly.</p><button onClick={() => setView('rules')}>Rules & sources</button></footer></>
}

const appRoot = globalThis.__astralChessRoot || createRoot(document.getElementById('root'))
globalThis.__astralChessRoot = appRoot
appRoot.render(<React.StrictMode><App/></React.StrictMode>)
