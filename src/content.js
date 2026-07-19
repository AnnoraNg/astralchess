export const courseSections = [
  { id: 'foundations', number: '01', title: 'The point of chess', icon: '✦', color: 'violet', buildsOn: 'No prior chess knowledge', description: 'Understand the goal, board, setup, coordinates, and how turns begin.' },
  { id: 'pieces', number: '02', title: 'Pieces & move language', icon: '♞', color: 'blue', buildsOn: 'Board orientation and turns', description: 'Master every piece, safe captures, and the notation used in later lessons.' },
  { id: 'special', number: '03', title: 'King safety & special rules', icon: '♚', color: 'gold', buildsOn: 'Every piece and legal captures', description: 'Recognise check, escape it, and understand castling, promotion, en passant, and draws.' },
  { id: 'opening', number: '04', title: 'How to start a game', icon: '⌁', color: 'cyan', buildsOn: 'Legal moves and king safety', description: 'Use principles—not memorised traps—to reach a safe, active position.' },
  { id: 'tactics', number: '05', title: 'Tactical vision', icon: '⚔', color: 'rose', buildsOn: 'Piece movement and safe captures', description: 'Spot forcing moves, loose pieces, forks, pins, skewers, and mating patterns.' },
  { id: 'middlegame', number: '06', title: 'Think through a full game', icon: '◈', color: 'violet', buildsOn: 'Opening principles and basic tactics', description: 'Use a repeatable thought process, form middlegame plans, and change priorities between phases.' },
  { id: 'endgame', number: '07', title: 'Finish with confidence', icon: '♙', color: 'gold', buildsOn: 'King movement, promotion, and calculation', description: 'Activate the king, create passed pawns, calculate races, and convert advantages.' },
  { id: 'mastery', number: '08', title: 'Play, review & improve', icon: '✎', color: 'blue', buildsOn: 'The complete beginner path', description: 'Play respectfully, review your decisions, and follow a sustainable improvement loop.' },
]

const L = (id, section, title, summary, data = {}) => ({
  id, section, title, summary, xp: 60, minutes: 7, icon: '✦', color: 'violet',
  eyebrow: 'Core lesson', takeaways: [], guide: [], ...data,
})

export const lessons = [
  L('objective', 'foundations', 'The mission: checkmate', 'Learn what you are trying to achieve, why kings are never captured, and what “winning” really means.', {
    icon: '♚', xp: 70, minutes: 8, eyebrow: 'Aim & victory',
    takeaways: ['Attack the enemy king so no legal reply exists', 'Checkmate—not capturing the king—wins the game', 'Resignation and time can also end a game; many positions are draws'],
    rule: 'Official rule · Your objective is checkmate: the opponent’s king is attacked and has no legal move. The king is never captured. A legal checkmate ends the game immediately.',
    guide: [
      { title: 'Check is a warning; mate is the finish', text: 'Check means the king is attacked. The defender must escape on that turn. Checkmate means every escape fails, so the game ends.' },
      { title: 'How games score', text: 'A win normally scores 1, a draw ½–½, and a loss 0. You can win by checkmate, resignation, or a time forfeit—unless no possible legal sequence could let you checkmate the player whose time expired.' },
      { title: 'Do not chase the king blindly', text: 'Winning pieces and improving your position often matter more than giving random checks. A check is useful only when it improves your situation.' },
    ],
    fen: '7k/5K2/8/8/8/8/6Q1/8 w - - 0 1', expected: { from: 'g2', to: 'g7', san: 'Qg7#' }, prompt: 'Finish the mission: move the queen from g2 to g7 for checkmate.', tip: 'Ask: is the king attacked, can it move, can the attacker be captured, or can the attack be blocked?',
    positionNote: 'This is a guided preview of the goal. Follow the named squares; queen movement is taught in Section 02.',
    checkpoint: { question: 'What is the actual aim of chess?', options: ['Capture every opposing piece', 'Checkmate the opposing king', 'Move your king to the other side'], answer: 1, explanation: 'FIDE defines the objective as attacking the king so the opponent has no legal move.' },
  }),
  L('board', 'foundations', 'Board, setup & turns', 'Orient the 8×8 board, read coordinates, set up every piece, and make the first move.', {
    icon: '▦', color: 'violet', eyebrow: 'Orientation',
    takeaways: ['Light square on the right; queens begin on their own colour', 'Files are a–h and ranks are 1–8', 'White moves first, then turns alternate'],
    rule: 'Official rule · The board has 64 equal squares. White moves first. Each side starts with eight pawns, two rooks, two knights, two bishops, one queen, and one king.',
    guide: [
      { title: 'Back-rank order', text: 'From the a-file: rook, knight, bishop, queen, king, bishop, knight, rook. White queen starts on d1; Black queen on d8.' },
      { title: 'Coordinates are your map', text: 'A square name combines its file letter and rank number. From White’s view, a1 is the bottom-left dark square and h1 the bottom-right light square.' },
      { title: 'A guided first turn', text: 'The exercise names both squares so you can practise coordinates and alternating turns. The e2 pawn may advance two clear squares because it has not moved; pawn rules come next.' },
    ],
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', expected: { from: 'e2', to: 'e4', san: 'e4' }, prompt: 'Find e2 and move its pawn two squares to e4.', positionNote: 'The complete starting position. White’s army is on ranks 1–2; Black’s is on ranks 7–8.', tip: '“Light on right” is the fastest board-orientation check.',
    checkpoint: { question: 'Who makes the first move?', options: ['Black', 'White', 'The player who won the last game'], answer: 1, explanation: 'White always makes the first move, then turns alternate.' },
  }),
  L('check', 'special', 'Give check—not checkmate', 'Learn what check means before practising how to escape it or finish with mate.', {
    icon: '!', color: 'rose', xp: 80, eyebrow: 'King under attack',
    takeaways: ['Check means the king is currently attacked', 'The checked player must answer on the next move', 'Check ends the game only when no legal response exists'],
    rule: 'Official rule · A king is in check when attacked. The defender may not make a move that leaves or exposes that king to attack. A check with no legal response is checkmate.',
    guide: [
      { title: 'Announce the problem', text: 'Giving check creates an immediate problem for the opponent. In casual play people may say “check,” but the attack exists whether or not anyone announces it.' },
      { title: 'Check is not automatically good', text: 'If the opponent can answer easily and improve their position, a random check may only waste time. First verify what the check achieves.' },
    ],
    fen: '4k3/8/8/8/8/8/4R3/4K3 w - - 0 1', expected: { from: 'e2', to: 'e7', san: 'Re7+' }, prompt: 'Give check without checkmate: move the rook from e2 to e7.', tip: 'The “+” in Re7+ means check. Black still has legal replies, so the game is not over.',
    checkpoint: { question: 'When does a checking move end the game?', options: ['Every time check is given', 'Only when the checked player has no legal response', 'Only when the queen gives check'], answer: 1, explanation: 'A check ends the game only when it is checkmate—an attacked king with no legal response.' },
  }),

  L('pawn', 'pieces', 'Pawn: small steps, big future', 'Move, capture, double-step, and understand why pawn direction matters.', {
    icon: '♙', color: 'gold', eyebrow: 'Piece movement',
    takeaways: ['Move straight ahead into an empty square', 'Capture one square diagonally forward', 'From its starting rank, a pawn may advance two clear squares'],
    rule: 'Official rule · A pawn advances into an empty square, may advance two clear squares on its first move, and captures one square diagonally forward. It never moves backward.',
    guide: [{ title: 'Pawns are directional', text: 'White pawns travel toward rank 8; Black pawns toward rank 1. A pawn never moves backward.' }, { title: 'Blocked versus capturable', text: 'A piece directly ahead blocks the pawn completely. An opposing piece one square diagonally forward may be captured; an empty diagonal cannot be entered by a normal pawn move.' }],
    fen: '7k/8/8/3p4/4P3/8/8/4K3 w - - 0 1', expected: { from: 'e4', to: 'd5', san: 'exd5' }, prompt: 'Pawns capture diagonally. Capture the black pawn on d5.', tip: 'Never confuse movement with capture: pawns move straight and capture diagonally.',
    checkpoint: { question: 'Can a pawn capture a piece directly in front of it?', options: ['Yes', 'No—it captures diagonally', 'Only on its first move'], answer: 1, explanation: 'A pawn cannot move into an occupied forward square; its normal captures are diagonal.' },
  }),
  L('knight', 'pieces', 'Knight: the jumper', 'See the L-shape, reach all eight destinations, and use the only piece that jumps.', {
    icon: '♞', color: 'blue', eyebrow: 'Piece movement',
    takeaways: ['Move two squares one way and one perpendicular', 'Jump over every intervening piece', 'Central knights usually control more squares'],
    rule: 'Official rule · A knight moves to the nearest square that is not on its current rank, file, or diagonal—the familiar 2-by-1 L-shape.',
    guide: [{ title: 'A fast visual test', text: 'Every knight move changes square colour: two squares in one direction, then one perpendicular.' }, { title: 'Centre versus edge', text: 'From the centre a knight can reach up to eight squares; from a corner only two. Count the L-shaped destinations in the exercise position.' }],
    fen: '7k/8/8/8/3N4/8/8/4K3 w - - 0 1', expected: { from: 'd4', to: 'f5', san: 'Nf5' }, prompt: 'Jump the knight from d4 to f5.', tip: 'Trace “two then one”—not a bent diagonal.',
    checkpoint: { question: 'Which piece can jump over other pieces?', options: ['Bishop', 'Knight', 'Rook'], answer: 1, explanation: 'Only the knight ignores intervening pieces.' },
  }),
  L('bishop', 'pieces', 'Bishop: diagonal laser', 'Travel long diagonals, respect blockers, and understand colour-bound movement.', {
    icon: '♗', color: 'cyan', eyebrow: 'Piece movement',
    takeaways: ['Move any distance diagonally', 'Never jump over a piece', 'A bishop remains on one square colour for the whole game'],
    rule: 'Official rule · A bishop moves along a diagonal and cannot pass through an intervening piece.',
    guide: [{ title: 'Follow one square colour', text: 'Because every diagonal alternates files and ranks together, a bishop remains on its starting square colour for the entire game.' }, { title: 'Stop at the first piece', text: 'A bishop may capture the first opposing piece on its diagonal but cannot continue through it. A friendly piece blocks the diagonal without being capturable.' }],
    fen: '8/7k/8/8/3B4/8/8/4K3 w - - 0 1', expected: { from: 'd4', to: 'g7', san: 'Bg7' }, prompt: 'Slide the bishop from d4 to g7.', tip: 'If the destination is the same colour and the path is clear, a bishop may be able to reach it.',
    checkpoint: { question: 'A bishop begins on a dark square. Which colours can it later occupy?', options: ['Dark only', 'Light only', 'Both'], answer: 0, explanation: 'Diagonal movement keeps a bishop on its original square colour.' },
  }),
  L('rook', 'pieces', 'Rook: ranks & files', 'Move along clear straight lines and stop correctly at friendly or opposing blockers.', {
    icon: '♖', color: 'rose', eyebrow: 'Piece movement',
    takeaways: ['Move any distance horizontally or vertically', 'Stop at the first blocking piece', 'Capture an opponent by landing on its square'],
    rule: 'Official rule · A rook moves along its rank or file and cannot pass through an intervening piece.',
    guide: [{ title: 'Four straight directions', text: 'From its square, a rook can travel up, down, left, or right. It never turns a corner during one move.' }, { title: 'Blockers set the limit', text: 'Scan each direction until the first occupied square. A friendly piece stops the rook; an opposing piece may be captured, but the rook stops there.' }],
    fen: '8/7k/8/8/3R4/8/8/4K3 w - - 0 1', expected: { from: 'd4', to: 'd8', san: 'Rd8' }, prompt: 'Move the rook straight from d4 to d8.', tip: 'Scan all four straight directions until the first blocker.',
    checkpoint: { question: 'Which path can a rook follow in one move?', options: ['A clear rank or file', 'A diagonal only', 'An L-shape'], answer: 0, explanation: 'A rook travels any clear distance horizontally along a rank or vertically along a file.' },
  }),
  L('queen', 'pieces', 'Queen: straight and diagonal', 'Combine rook and bishop movement while respecting every blocker in its path.', {
    icon: '♕', color: 'violet', eyebrow: 'Piece movement',
    takeaways: ['Move along ranks, files, or diagonals', 'Cannot jump over intervening pieces', 'Capture by landing on the first opposing piece in a line'],
    rule: 'Official rule · A queen moves along a rank, file, or diagonal and cannot pass through an intervening piece.',
    guide: [{ title: 'Rook plus bishop movement', text: 'The queen combines every clear straight-line move of a rook with every clear diagonal move of a bishop.' }, { title: 'Still a sliding piece', text: 'Its range is large, but the queen cannot jump. A friendly piece blocks it; the first opposing piece in a line may be captured.' }],
    fen: 'k7/8/8/8/3Q4/8/8/4K3 w - - 0 1', expected: { from: 'd4', to: 'h4', san: 'Qh4' }, prompt: 'Use the queen’s straight-line movement from d4 to h4.', tip: 'The queen can also use diagonals, but it cannot turn during one move.',
    checkpoint: { question: 'Which movements does the queen combine?', options: ['Knight and pawn', 'Rook and bishop', 'King and knight'], answer: 1, explanation: 'The queen moves any clear distance straight or diagonally.' },
  }),
  L('king', 'pieces', 'King: priceless & restricted', 'Move one square safely, recognise attacked destinations, and keep opposing kings apart.', {
    icon: '♔', color: 'gold', eyebrow: 'Piece movement',
    takeaways: ['Move one square in any direction', 'Never move onto an attacked square', 'Opposing kings may never stand next to each other'],
    rule: 'Official rule · The king moves to an adjoining square but may not move into check. Opposing kings can therefore never stand adjacent.',
    guide: [{ title: 'Eight neighbouring squares', text: 'From the centre, the king may have up to eight destinations: horizontal, vertical, and diagonal neighbours.' }, { title: 'Attacked squares are forbidden', text: 'A destination is illegal if any enemy piece attacks it. Because a king attacks every neighbouring square, the two kings can never be adjacent.' }],
    fen: '7k/8/8/8/8/8/4K3/8 w - - 0 1', expected: { from: 'e2', to: 'e3', san: 'Ke3' }, prompt: 'Move the king one square from e2 to e3.', tip: 'Before every king move, scan all enemy attacks on the destination.',
    checkpoint: { question: 'May two kings stand on adjacent squares?', options: ['Yes', 'No, because each would attack the other', 'Only in an endgame'], answer: 1, explanation: 'A king may never move onto a square attacked by the enemy king.' },
  }),
  L('capture', 'pieces', 'Capture, value & defence', 'Stop losing pieces for free by counting attackers, defenders, and likely recaptures.', {
    icon: '⚖', color: 'rose', xp: 80, eyebrow: 'Material safety',
    takeaways: ['Capture by replacing an enemy piece on its square', 'Approximate values: pawn 1, knight/bishop 3, rook 5, queen 9', 'A “free” piece may be defended—calculate the reply'],
    rule: 'Official rule · A capture removes the opposing piece from its square. Strategy · Compare what is won and lost after all sensible recaptures, while keeping king safety first.',
    guide: [{ title: 'The blunder check', text: 'Before releasing a move, ask: what can they capture? Is my destination defended? Did I leave any piece undefended?' }, { title: 'Value is a guide, not a law', text: 'Activity, king safety, passed pawns, and checkmate threats can matter more than point totals. Never trade your king safety for a pawn-count slogan.' }],
    fen: '7k/8/5p2/8/4N3/8/8/4K3 w - - 0 1', expected: { from: 'e4', to: 'f6', san: 'Nxf6' }, prompt: 'Capture the loose pawn on f6 with the knight.', tip: 'After imagining your capture, switch sides and find the opponent’s strongest reply.',
    checkpoint: { question: 'Before taking a piece, what should you check?', options: ['Whether your capturer can be recaptured', 'Whether it is move ten', 'Whether queens remain'], answer: 0, explanation: 'Calculate the opponent’s best legal reply before calling material free.' },
  }),

  L('escaping-check', 'special', 'Survive a check', 'Practise the move–capture–block checklist until it becomes automatic.', {
    icon: '◇', color: 'rose', eyebrow: 'King safety',
    takeaways: ['Identify every checking piece', 'List king moves, captures, and blocks', 'Double check can only be answered by moving the king'],
    rule: 'Official rule · You must end the checking attack immediately. If no legal response exists, it is checkmate.',
    guide: [{ title: 'Do not panic-move the king', text: 'Sometimes capturing the attacker or blocking the line is stronger because it preserves castling rights or keeps the king sheltered.' }, { title: 'Double check exception', text: 'When two pieces check at once, capturing or blocking only one is insufficient. The king must move.' }],
    fen: '4k3/8/8/1B6/8/8/8/4K3 b - - 0 1', expected: { from: 'e8', to: 'd8', san: 'Kd8' }, prompt: 'The bishop checks along the diagonal. Move Black’s king from e8 to d8.', tip: 'Trace the full line from attacker to king before choosing an escape.',
    checkpoint: { question: 'Which response is impossible against a knight check?', options: ['Capture the knight', 'Move the king', 'Block the knight’s attack'], answer: 2, explanation: 'A knight’s jump has no line between attacker and king, so it cannot be blocked.' },
  }),
  L('special', 'special', 'Castling, completely explained', 'Move the king and rook together, know every restriction, and understand why players castle.', {
    icon: '♔', color: 'cyan', xp: 90, minutes: 10, eyebrow: 'Special rule',
    takeaways: ['King moves two squares toward a rook; rook lands on the crossed square', 'King and chosen rook must never have moved; the path must be empty', 'King cannot castle from, through, or into check'],
    rule: 'Official rule · Castling counts as one king move: king e1→g1 and rook h1→f1 (kingside), or king e1→c1 and rook a1→d1 (queenside), mirrored for Black.',
    guide: [
      { title: 'Why castle?', text: 'It usually tucks the king behind pawns and activates a corner rook in one move. Castling is helpful, not compulsory; first check whether the destination is actually safe.' },
      { title: 'Rights lost forever', text: 'If the king has moved, that side can never castle. If a rook moved and returned, castling with that rook is still forbidden.' },
      { title: 'Temporary blockers', text: 'Pieces between king and rook must move away. The king’s start, crossing, and landing squares may not be attacked. The rook may cross an attacked square, and the rook itself may be under attack.' },
      { title: 'How to do it here', text: 'Select the king—not the rook—and move it two squares. The board relocates the rook automatically.' },
    ],
    fen: '4k2r/8/8/8/8/8/8/4K2R w Kk - 0 1', expected: { from: 'e1', to: 'g1', san: 'O-O' }, prompt: 'Castle kingside: select the king on e1, then g1.', tip: 'Unmoved pieces are not enough: also verify a clear path and safe king squares.',
    checkpoint: { question: 'Which square may be attacked while White castles kingside?', options: ['e1, the start', 'f1, the crossing square', 'h1, the rook’s starting square'], answer: 2, explanation: 'The king’s e1, f1, and g1 squares must be safe. An attack on the rook’s h1 square does not itself prevent castling.' },
  }),
  L('promotion', 'special', 'Promotion is real—and powerful', 'Prove the rule on the board, choose among four pieces, and understand underpromotion.', {
    icon: '♛', color: 'gold', xp: 90, minutes: 10, eyebrow: 'Special rule',
    takeaways: ['A pawn reaching its farthest rank must promote immediately', 'Choose a queen, rook, bishop, or knight of the same colour', 'The new piece acts immediately; extra queens are legal'],
    rule: 'Official FIDE rule 3.7.3.3–5 · Promotion is absolutely real. On the farthest rank, a pawn must immediately become a queen, rook, bishop, or knight. The choice is not limited to captured pieces.',
    guide: [
      { title: 'What happens in this app', text: 'Move the pawn onto the last rank. A chooser appears. Pick a piece; the pawn disappears and the new piece occupies that square as part of the same move.' },
      { title: 'Usually choose a queen', text: 'The queen is strongest and is the normal choice. You may legally have two or more queens if multiple pawns promote.' },
      { title: 'Why ever choose less?', text: 'Underpromotion means choosing a rook, bishop, or knight. A knight may give a unique check or fork; a rook or bishop can occasionally avoid stalemate.' },
      { title: 'No waiting on the last rank', text: 'A pawn cannot remain a pawn on rank 8 or rank 1. Promotion is compulsory and its effect is immediate.' },
    ],
    fen: '7k/4P3/8/8/8/8/8/K7 w - - 0 1', expected: { from: 'e7', to: 'e8', san: 'e8=Q+', promotion: 'q' }, prompt: 'Promote normally: move e7 to e8, then choose a queen in the pop-up.', tip: 'Queen is the practical default. Underpromote only when you see a concrete reason.',
    checkpoint: { question: 'Which statement is true?', options: ['Promotion is optional', 'You may promote only to a captured piece', 'A new queen is legal even if your first queen remains'], answer: 2, explanation: 'FIDE explicitly says the choice is not restricted to previously captured pieces.' },
  }),
  L('enpassant', 'special', 'En passant without confusion', 'Learn the exact one-move window for the unusual pawn capture.', {
    icon: '♟', color: 'rose', eyebrow: 'Special rule',
    takeaways: ['Enemy pawn must just have advanced two squares', 'It must finish beside your pawn', 'Capture on the immediate reply or lose the opportunity'],
    rule: 'Official rule · An eligible pawn may capture the adjacent pawn as though its two-square move had been only one square. This is legal only on the immediately following move.',
    guide: [{ title: 'Why the rule exists', text: 'The initial two-square advance cannot be used to sprint past a pawn that could have captured it after a one-square move.' }, { title: 'What disappears', text: 'Your pawn moves diagonally into the empty passed-over square; the opposing pawn is removed from the adjacent square.' }],
    fen: '7k/8/8/3pP3/8/8/8/K7 w - d6 0 2', expected: { from: 'e5', to: 'd6', san: 'exd6' }, prompt: 'Capture en passant: move e5 to d6.', tip: 'If you make any other move, this exact opportunity expires.',
    checkpoint: { question: 'How long does an en passant opportunity last?', options: ['One immediate reply', 'Until the pawn moves again', 'The whole game'], answer: 0, explanation: 'It exists only on the move immediately after the two-square pawn advance.' },
  }),
  L('draws', 'special', 'Draws are part of chess', 'Recognise stalemate, dead positions, repetition, move-count rules, and agreed draws.', {
    icon: '½', color: 'blue', eyebrow: 'Game results',
    takeaways: ['Stalemate: no legal move and not in check', 'Dead position: no possible legal sequence can produce mate', 'Repetition and move-count rules may be claim-based or automatic'],
    rule: 'Official rule · Draws include stalemate, dead position, agreement, threefold repetition or 50 moves on a valid claim, and automatic fivefold repetition or 75 moves.',
    guide: [
      { title: 'Stalemate is not checkmate', text: 'Both leave the player with no legal move, but checkmate requires the king to be attacked. In stalemate the king is not attacked, so the game is drawn. The exercise lets you compare that geometry directly.' },
      { title: 'A dead position cannot become mate', text: 'A position is dead when no legal sequence—not even with poor cooperation—can ever lead to checkmate. King against king is the simplest example.' },
      { title: 'Claim versus automatic', text: 'Threefold repetition and the 50-move rule generally require a correct claim. Fivefold repetition and 75 moves without a pawn move or capture end the game automatically.' },
      { title: 'Time can still draw', text: 'If a player runs out of time but the opponent cannot possibly checkmate by any legal sequence, the result is a draw.' },
    ],
    fen: '7k/5K2/8/6Q1/8/8/8/8 w - - 0 1', expected: { from: 'g5', to: 'g6', san: 'Qg6' }, prompt: 'Create stalemate on purpose: play Qg6. Black will have no legal move but will not be in check.', tip: 'This is a demonstration, not a goal when you are winning. Learn to recognise the same geometry so you can avoid it later.',
    checkpoint: { question: 'No legal moves and no check means…', options: ['A win', 'Stalemate and a draw', 'The opponent skips a turn'], answer: 1, explanation: 'Stalemate is an immediate draw.' },
  }),

  L('opening', 'opening', 'Your opening compass', 'Use four principles to start confidently without memorising a forest of variations.', {
    icon: '⌁', color: 'cyan', xp: 80, minutes: 9, eyebrow: 'Opening principles',
    takeaways: ['Influence the centre', 'Develop knights and bishops', 'Castle and connect the rooks'],
    rule: 'Strategy, not law · Fight for central space, develop minor pieces, safeguard the king, and avoid wasting tempi. Principles can be broken for a concrete tactical reason.',
    guide: [{ title: 'A practical first-game recipe', text: 'Move a central pawn; develop a knight; develop a bishop; castle. Then move the queen and rooks toward useful files. Check the opponent’s threat after every move.' }, { title: 'Control is not occupation', text: 'A piece controls a square if it could capture there. You can influence the centre with pawns and pieces without placing everything in it.' }, { title: 'Do not memorise yet', text: 'Learn why moves work before studying named openings. A sound position you understand is better than a memorised line you cannot continue.' }],
    fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', expected: { from: 'e7', to: 'e5', san: 'e5' }, prompt: 'Claim central space for Black with e7–e5.', tip: 'Each early move should ideally develop, control the centre, or improve king safety.',
    checkpoint: { question: 'Which is guidance rather than a legal rule?', options: ['Develop minor pieces early', 'White moves first', 'Never leave your king in check'], answer: 0, explanation: 'Development is a strong principle, but positions can justify exceptions.' },
  }),
  L('development', 'opening', 'Development & tempo', 'Bring pieces into play efficiently and stop helping your opponent gain free time.', {
    icon: '↗', color: 'blue', eyebrow: 'Opening play',
    takeaways: ['A developed piece influences useful squares', 'Repeated moves can lose time', 'Do not block your own pieces unnecessarily'],
    rule: 'Strategy · A tempo is one move’s worth of time. In the opening, spend tempi mobilising your army unless a threat demands attention.',
    guide: [{ title: 'Knights before bishops?', text: 'Often, but not always. Knights have natural central squares; a bishop’s best diagonal may depend on the pawn structure.' }, { title: 'Queen raids cost time', text: 'An early queen can be chased by cheaper pieces, letting the opponent develop with threats.' }],
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2', expected: { from: 'g1', to: 'f3', san: 'Nf3' }, prompt: 'Develop the kingside knight to f3 while attacking e5.', tip: 'Ask whether your move improves a new piece or merely moves an already active one again.',
    checkpoint: { question: 'What is a tempo?', options: ['A chess piece', 'One move’s worth of time', 'A forced draw'], answer: 1, explanation: 'Efficient development uses each early tempo purposefully.' },
  }),
  L('opening-danger', 'opening', 'Opening danger radar', 'Recognise direct opening threats against f2 or f7 and respond before continuing development.', {
    icon: '⚠', color: 'rose', eyebrow: 'Beginner pitfalls',
    takeaways: ['Check enemy threats before following your plan', 'The f2/f7 pawn begins protected only by the king', 'Track loose pieces and every new attack after an opponent’s move'],
    rule: 'Strategy · Opening principles do not override tactics. Before every move, scan the opponent’s checks, captures, and direct threats.',
    guide: [{ title: 'Scholar’s Mate pattern', text: 'A queen and bishop may combine against f7 or f2. Do not memorise panic moves: notice the two attackers and add defence or attack the queen with development.' }, { title: 'Loose pieces drop off', text: 'An undefended piece can fall to a fork or simple capture. After each opponent move, identify what they attacked.' }],
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3', expected: { from: 'g7', to: 'g6', san: 'g6' }, prompt: 'White threatens Qxf7 checkmate. Play g6 to attack the queen and remove the immediate mating threat.', tip: 'Do not copy an opening recipe while mate is threatened. Answer the threat first, then return to development.',
    checkpoint: { question: 'What should come before your own plan?', options: ['The opponent’s threat', 'Moving the queen', 'Counting total moves'], answer: 0, explanation: 'A plan that ignores a forcing threat is not playable.' },
  }),

  L('tactical-scan', 'tactics', 'The forcing-move scan', 'Build a reliable safety check using checks, captures, and threats.', {
    icon: '◎', color: 'rose', xp: 80, eyebrow: 'Thinking tool',
    takeaways: ['First understand the opponent’s last move', 'Examine checks and captures before quiet ideas', 'Verify the reply before committing'],
    rule: 'Coaching framework · Scan checks, captures, and threats for both sides. This is not a FIDE rule; it is a practical way to avoid overlooking forcing moves.',
    guide: [{ title: 'Opponent first', text: 'Ask: why did they play that? What now attacks me? What became undefended? Then generate your own candidates.' }, { title: 'Forcing does not mean good', text: 'A check may drive the king somewhere safer; a capture may lose material. Calculate the strongest response, not just the exciting first move.' }],
    fen: '6k1/5ppp/8/8/8/3Q4/8/4K3 w - - 0 1', expected: { from: 'd3', to: 'd8', san: 'Qd8#' }, prompt: 'Start with checks: find Qd8 checkmate.', tip: 'For each candidate, ask “If I play it, what is their best reply?”',
    checkpoint: { question: 'Which scan is a useful starting point?', options: ['Checks, captures, threats', 'Only checks', 'Only pawn moves'], answer: 0, explanation: 'The scan helps you notice forcing possibilities before evaluating quieter moves.' },
  }),
  L('forks', 'tactics', 'Forks & double attacks', 'Attack two targets at once so one cannot escape.', {
    icon: '⑂', color: 'blue', eyebrow: 'Tactical pattern',
    takeaways: ['A fork attacks at least two targets', 'Knights and pawns are famous for forks', 'Check-forcing forks are especially powerful'],
    rule: 'Tactic · A double attack creates two threats with one move. The defender often has time to answer only one.',
    guide: [{ title: 'Look for geometry', text: 'Knight fork squares sit an L away from both targets. Pawn forks attack two forward diagonals. Queens can double-attack along mixed lines.' }, { title: 'Check the fork square', text: 'A beautiful fork fails if the forking piece can simply be captured. Verify the landing square and all forcing replies.' }],
    fen: '4k3/8/8/1N1q4/8/8/8/4K3 w - - 0 1', expected: { from: 'b5', to: 'c7', san: 'Nc7+' }, prompt: 'Play Nc7+: the knight checks the king on e8 and attacks the queen on d5 at the same time.', tip: 'Do not stop at seeing two attacks—confirm whether the opponent has a forcing escape.',
    checkpoint: { question: 'What defines a fork?', options: ['One piece attacks two or more targets', 'Two pieces attack one target', 'A pinned pawn'], answer: 0, explanation: 'A fork creates multiple simultaneous threats with one piece.' },
  }),
  L('pins-skewers', 'tactics', 'Pins & skewers', 'Use line-piece geometry to exploit a more valuable piece behind or in front.', {
    icon: '↦', color: 'cyan', eyebrow: 'Tactical pattern',
    takeaways: ['A pin discourages movement because something behind would fall', 'An absolute pin to the king makes moving illegal', 'A skewer attacks the valuable front piece, then wins what is behind'],
    rule: 'Tactic · Rooks, bishops, and queens create pins and skewers on ranks, files, and diagonals. Only a pin exposing the king makes the pinned move illegal.',
    guide: [{ title: 'Relative versus absolute', text: 'A relatively pinned piece may legally move, though material may be lost. An absolutely pinned piece cannot move if doing so exposes its king.' }, { title: 'Break the line', text: 'Defend by moving the valuable piece, blocking the line, capturing the attacker, or creating a stronger threat.' }],
    fen: '4k3/8/2n5/8/2B5/8/8/4K3 w - - 0 1', expected: { from: 'c4', to: 'b5', san: 'Bb5' }, prompt: 'Play Bb5, pinning the knight on c6 to the king on e8. Moving that knight would expose check.', tip: 'Extend every rook, bishop, and queen line through the first target to see what stands behind.',
    checkpoint: { question: 'When is a pinned piece legally unable to move?', options: ['When moving would expose its king', 'Whenever a queen is behind it', 'Every time it is attacked'], answer: 0, explanation: 'Only exposing your own king makes the move illegal.' },
  }),
  L('mating-patterns', 'tactics', 'Mating patterns', 'Recognise boxed kings, back ranks, and coordinated queen-and-rook finishes.', {
    icon: '#', color: 'gold', xp: 90, eyebrow: 'Checkmate vision',
    takeaways: ['Count every king escape square', 'Protect the checking piece', 'Use your pieces together to cover exits'],
    rule: 'Tactic · A mating pattern is reusable geometry, not a guaranteed combination. Confirm captures, blocks, and king moves in the actual position.',
    guide: [{ title: 'Back-rank mate', text: 'A rook or queen checks along the back rank while the king’s own pawns remove its flight squares. Creating “luft” with a safe pawn move can prevent it.' }, { title: 'Ladder mate', text: 'Two heavy pieces can take turns checking across adjacent ranks or files, pushing the king to the edge.' }],
    fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', expected: { from: 'e1', to: 'e8', san: 'Re8#' }, prompt: 'Use the boxed-in king: play Re8 checkmate.', tip: 'After announcing mate, prove all three: no king move, no capture, no block.',
    checkpoint: { question: 'What often causes a back-rank mate?', options: ['The king is boxed by its own pawns', 'No queens remain', 'A knight is in the centre'], answer: 0, explanation: 'The king’s pawn shelter can also remove its flight squares.' },
  }),

  L('thought-process', 'middlegame', 'Think before every move', 'Use a six-question routine so your moves have a reason and fewer pieces vanish.', {
    icon: '◈', color: 'violet', xp: 90, minutes: 11, eyebrow: 'Decision process',
    takeaways: ['Read the opponent’s last move', 'Generate two or three candidate moves', 'Calculate, evaluate, then blunder-check'],
    rule: 'Coaching framework · 1) What changed? 2) Am I in danger? 3) What forcing moves exist? 4) What are my candidates? 5) What is their best reply? 6) Final blunder check.',
    guide: [
      { title: '1 · Read the move', text: 'What did the moved piece attack, defend, open, or abandon? Is there a direct threat?' },
      { title: '2 · Scan forcing moves', text: 'Check both sides’ checks, captures, and threats. If you face check, the legal-response rules take priority.' },
      { title: '3 · Choose candidates', text: 'Compare two or three moves: a forcing move, a move that improves your least active piece, and a move serving your plan.' },
      { title: '4 · Calculate replies', text: 'For each candidate, imagine the opponent’s strongest answer—not the reply you hope they play.' },
      { title: '5 · Evaluate', text: 'Compare material, king safety, piece activity, pawn structure, and space.' },
      { title: '6 · Hover, then scan', text: 'Before releasing the piece, ask: does this hang my queen, allow checkmate, or leave something undefended?' },
    ],
    fen: '6k1/4q3/8/8/8/8/8/4R1K1 w - - 0 1', expected: { from: 'e1', to: 'e7', san: 'Rxe7' }, prompt: 'Use the routine: scan captures, notice the undefended queen on e7, and verify Rxe7 before playing it.', tip: 'Your opponent is allowed to find their best move. After every candidate, imagine their strongest reply.',
    checkpoint: { question: 'What is the best final check before moving?', options: ['Does this allow a forcing reply or hang a piece?', 'Is this the prettiest move?', 'Have I moved every pawn?'], answer: 0, explanation: 'A short blunder check prevents many beginner losses.' },
  }),
  L('plans', 'middlegame', 'Make a middlegame plan', 'Improve your worst piece, use open lines, and attack weaknesses rather than shadows.', {
    icon: '☍', color: 'blue', eyebrow: 'Strategy',
    takeaways: ['Improve your least active piece', 'Place rooks on open files', 'Target weaknesses that cannot easily move'],
    rule: 'Strategy · If there is no immediate tactic, let the position choose the plan: king safety, weak pawns, open lines, space, and inactive pieces are your clues.',
    guide: [{ title: 'Worst-piece rule', text: 'Find the piece contributing least and give it a better square. This creates progress without inventing a premature attack.' }, { title: 'Pawn structure is the map', text: 'Pawn chains point toward space and attacks. Isolated, backward, and doubled pawns can become long-term targets, but only if you can reach them.' }, { title: 'Trades need a reason', text: 'When ahead in material, exchanging pieces usually reduces counterplay. When behind, keep complexity and avoid trading your active pieces automatically.' }],
    fen: 'r4rk1/ppp2ppp/2n5/8/2B5/5N2/PPP2PPP/R5KR w - - 0 1', expected: { from: 'a1', to: 'e1', san: 'Re1' }, prompt: 'No tactic is available. Improve the a1 rook by placing it on the open e-file with Re1.', tip: 'Still scan for tactics first; when none exist, improve the position of your least active piece.',
    checkpoint: { question: 'With no forcing tactic, which is a sound plan?', options: ['Improve your least active piece', 'Give a random check', 'Move the same piece repeatedly'], answer: 0, explanation: 'Piece activity is a reliable positional guide.' },
  }),
  L('phase-guide', 'middlegame', 'Opening → middlegame → endgame', 'Know what changes between phases and which priorities should change with it.', {
    icon: '≋', color: 'cyan', minutes: 10, eyebrow: 'Whole-game map',
    takeaways: ['Opening: mobilise and secure the king', 'Middlegame: calculate tactics and execute plans', 'Endgame: activate king and push passed pawns'],
    rule: 'Strategy · Phases blend rather than switch on an exact move. Change priorities when development, queen trades, material reduction, and king safety change the position.',
    guide: [{ title: 'Opening questions', text: 'Am I developed? Is my king safe? Who controls the centre? Am I wasting a tempo?' }, { title: 'Middlegame questions', text: 'What is threatened? Which forcing moves exist? What is my worst piece? Which pawn break changes the position?' }, { title: 'Endgame questions', text: 'Can my king enter? Is there a passed pawn? Should I trade pieces or pawns? Can I calculate the promotion race?' }],
    fen: '7k/8/8/8/8/8/8/K7 w - - 0 1', expected: { from: 'a1', to: 'b2', san: 'Kb2' }, prompt: 'With the major attacking pieces gone, begin the king’s route toward the centre with Kb2.', tip: 'King safety reverses: with major attacking forces gone, a passive king often becomes a weakness.',
    checkpoint: { question: 'Which priority usually rises in an endgame?', options: ['Activating the king', 'Hiding the king in a corner', 'Developing the queen early'], answer: 0, explanation: 'The king becomes a powerful active piece after major attackers leave.' },
  }),

  L('king-endgame', 'endgame', 'Activate the king', 'Centralise the king with purpose and recognise the geometry of direct opposition.', {
    icon: '♔', color: 'gold', xp: 80, eyebrow: 'Endgame foundation',
    takeaways: ['The king becomes an attacking piece in endings', 'Direct opposition means one square separates the kings', 'The player who does not have to yield often controls the entry squares'],
    rule: 'Strategy · With reduced mating danger, centralise your king. In direct opposition, the kings face on a rank or file with one square between them; the player who does not have the move often has the advantage.',
    guide: [{ title: 'Centralise with purpose', text: 'An active king attacks pawns, supports its own pawns, and blocks the opposing king. Move toward a concrete entry square rather than the centre by habit.' }, { title: 'Take direct opposition', text: 'If the opposing king is three squares away on the same rank or file, stepping forward can leave one square between the kings and give the move to your opponent. Their king must then yield sideways or backward.' }],
    fen: '8/8/4k3/8/8/4K3/8/8 w - - 0 1', expected: { from: 'e3', to: 'e4', san: 'Ke4' }, prompt: 'Play Ke4. The kings now face with e5 between them and Black to move, so White has direct opposition.', tip: 'Opposition depends on geometry and whose turn it is. One tempo can reverse the result.',
    checkpoint: { question: 'What describes direct opposition?', options: ['Kings face with one square between them', 'Kings stand next to each other', 'Both kings remain in their corners'], answer: 0, explanation: 'In direct opposition the kings face on a rank or file with exactly one square between them.' },
  }),
  L('passed-pawns', 'endgame', 'Passed pawns & promotion races', 'Create a pawn with no enemy pawn in its path and calculate whether it can queen.', {
    icon: '♙', color: 'cyan', eyebrow: 'Endgame weapon',
    takeaways: ['A passed pawn has no opposing pawn ahead on its file or adjacent files', 'Escort it with the king or pieces', 'Use the rule of the square as a quick king-catch test'],
    rule: 'Strategy · Passed pawns must be pushed—but only after checking whether they can be caught, blockaded, or exchanged.',
    guide: [{ title: 'Rule of the square', text: 'Imagine a square from the pawn to its promotion rank, as wide as the remaining journey. If the enemy king can enter the square on its move, it can often catch the pawn.' }, { title: 'Outside passed pawn', text: 'A faraway passer can drag the enemy king aside, letting your king win pawns on the other wing.' }],
    fen: 'k7/8/8/8/4P3/8/8/7K w - - 0 1', expected: { from: 'e4', to: 'e5', san: 'e5' }, prompt: 'Because White moves now, play e5 and shrink the rule-of-the-square boundary beyond the black king’s reach.', tip: 'Count both sides to promotion, including whose turn it is and whether promotion gives check.',
    checkpoint: { question: 'What is a passed pawn?', options: ['A pawn with no opposing pawn able to stop it on its file or adjacent files', 'Any pawn on rank four', 'A captured pawn'], answer: 0, explanation: 'Its path is free of enemy pawns, though pieces and kings may still stop it.' },
  }),
  L('endgame-conversion', 'endgame', 'Convert a winning endgame', 'Trade wisely, avoid stalemate, and turn material advantage into checkmate.', {
    icon: '✓', color: 'violet', xp: 90, minutes: 10, eyebrow: 'Winning technique',
    takeaways: ['When ahead, trade pieces more readily than pawns', 'Keep checking for stalemate', 'Learn basic queen and rook mates'],
    rule: 'Strategy · Simplification helps only if the resulting ending is still winning. Calculate the final pawn race or mating method before exchanging.',
    guide: [{ title: 'Queen mate method', text: 'Use the queen to shrink the enemy king’s available area, then bring your king close enough to protect the mating move. Keep checking for stalemate whenever you make the box smaller.' }, { title: 'Rook mate method', text: 'Cut the enemy king off with the rook, bring your king up, and shrink the box until an edge-file or edge-rank mate is possible.' }, { title: 'Trade pieces, preserve the win', text: 'When materially ahead, exchanging enemy pieces usually reduces counterplay. Before trading pawns, confirm the remaining material can still promote or checkmate.' }],
    fen: 'k7/2Q5/2K5/8/8/8/8/8 w - - 0 1', expected: { from: 'c7', to: 'b7', san: 'Qb7#' }, prompt: 'Finish the queen-and-king method: play the protected move Qb7 checkmate.', tip: 'Before a final move, distinguish checkmate from stalemate by verifying whether the king is attacked.',
    checkpoint: { question: 'When ahead in material, which exchange is often helpful?', options: ['Trading pieces while keeping winning pawns', 'Trading away every pawn automatically', 'Giving up the queen for no reason'], answer: 0, explanation: 'Reducing enemy pieces usually reduces counterplay, provided the resulting ending remains winning.' },
  }),

  L('notation', 'pieces', 'Read chess notation', 'Decode the move language used by every later lesson, chess book, and game record.', {
    icon: '✎', color: 'blue', eyebrow: 'Chess language',
    takeaways: ['Piece letter + destination: Nf3; pawns omit a letter: e4', 'x is capture, + check, # mate', 'Castling is O-O or O-O-O; promotion adds =Q, =R, =B, or =N'],
    rule: 'Convention · Standard algebraic notation records each move compactly. FIDE competition scoresheets use algebraic notation.',
    guide: [{ title: 'Disambiguation', text: 'If two identical pieces can reach the same square, add a file or rank: Nbd2 or R1e2. Capturing pawns include the starting file, as in exd5.' }, { title: 'Special notation', text: 'O-O is kingside castling; O-O-O queenside. e8=Q promotes. “+” means check and “#” means checkmate.' }],
    fen: 'r3k2r/ppp2ppp/2n5/3p4/2B5/5N2/PPP2PPP/R3K2R w KQkq - 0 1', expected: { from: 'c4', to: 'd5', san: 'Bxd5' }, prompt: 'Read and play Bxd5: the bishop captures the pawn on d5.', tip: 'B names the bishop, x means capture, and d5 is the destination.',
    checkpoint: { question: 'What does Nxf6+ mean?', options: ['Knight captures on f6 with check', 'Pawn captures a knight', 'Knight promotes'], answer: 0, explanation: 'N names the knight, x the capture, f6 the destination, and + the check.' },
  }),
  L('etiquette', 'mastery', 'Clock, touch-move & etiquette', 'Know the practical behaviours people follow in over-the-board chess.', {
    icon: '♜', color: 'rose', xp: 80, minutes: 9, eyebrow: 'Tournament play',
    takeaways: ['Move and press the clock with the same hand', 'A deliberately touched movable piece normally must move', 'Say “I adjust” before centring a piece'],
    rule: 'Official over-the-board rule · Use one hand for the move and that same hand for the clock. Touch-move applies to deliberate contact; call the arbiter for a ruling.',
    guide: [{ title: 'When something goes wrong', text: 'Pause the clock and call the arbiter. Do not argue across the board or repair a disputed position by yourself.' }, { title: 'Fair play', text: 'Do not use notes, outside advice, analysis on another board, or unapproved electronic devices. Avoid distracting your opponent.' }, { title: 'Good manners', text: 'Arrive on time, play quietly, offer a handshake if culturally appropriate, and report the result as the event requires.' }],
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3', expected: { from: 'f1', to: 'b5', san: 'Bb5' }, prompt: 'Touch-move case: you deliberately touched the bishop on f1, and it has legal moves. Move that bishop to b5; over the board, you would then press the clock with the same hand.', tip: 'The digital board cannot enforce physical touch-move, so the rule checkpoint confirms the tournament procedure.',
    checkpoint: { question: 'You deliberately touch a movable knight. What normally follows?', options: ['You must move it legally', 'You automatically lose', 'You may ignore it'], answer: 0, explanation: 'Touch-move requires the deliberately touched piece to move if it has a legal move.' },
  }),
  L('mastery-path', 'mastery', 'A path from beginner to player', 'Turn lessons into lasting skill with a realistic practice loop and clear milestones.', {
    icon: '✦', color: 'violet', xp: 100, minutes: 12, eyebrow: 'Progress plan',
    takeaways: ['Play slow enough to think, then review', 'Mix tactics, endgames, and full games', 'Track decision quality before rating'],
    rule: 'Training guidance · Improvement is cyclical: learn one idea, solve focused positions, use it in a game, review without an engine first, then verify and repeat.',
    guide: [
      { title: 'Stage 1 · Legal confidence', text: 'Know every move, check response, checkmate, stalemate, castling, promotion, and en passant. Finish Sections 1–3.' },
      { title: 'Stage 2 · Start safely', text: 'Use the centre, development, and king-safety principles in Section 4. Play short practice openings and explain the purpose of each move instead of memorising names.' },
      { title: 'Stage 3 · Stop one-move losses', text: 'Use the opponent-threat and blunder checks every turn. Practise the hanging pieces, forks, pins, and mate-in-one patterns from Section 5.' },
      { title: 'Stage 4 · Play complete games', text: 'Use the Section 6 thought process in slower games—about 10–15 minutes plus increment or longer. Review where the position changed and which phase priorities you missed.' },
      { title: 'Stage 5 · Build technique', text: 'Add the king activity, passed-pawn races, and basic queen/rook mating methods from Section 7, then use Section 8 to review and plan the next cycle.' },
      { title: 'A sustainable week', text: 'Three short tactic sessions, two slow games with review, and one endgame session beat hours of unreviewed blitz. Keep notes on repeated mistakes.' },
      { title: 'Review order', text: 'First annotate without help: threats missed, candidate moves, time use, and turning points. Then use analysis to check—not replace—your thinking.' },
    ],
    fen: '6k1/8/3b4/8/2b4q/8/5PPP/3Q2K1 w - - 0 1', expected: { from: 'g2', to: 'g3', san: 'g3' }, prompt: 'Final case: Black threatens Qxh2 checkmate: the bishop on d6 protects h2, while the bishop on c4 covers the king’s f1 escape. Play g3 to attack the queen and interrupt the d6–h2 diagonal.', tip: 'Use the full routine: name the threat, account for every escape square, compare candidate defenses, and verify the opponent’s best reply.',
    checkpoint: { question: 'Which practice loop builds durable skill?', options: ['Learn, practise, play, review, verify', 'Play only fast games', 'Memorise openings without review'], answer: 0, explanation: 'Focused learning plus reviewed games turns knowledge into decisions.' },
  }),
]

const lessonSequence = [
  'objective', 'board',
  'pawn', 'knight', 'bishop', 'rook', 'queen', 'king', 'capture', 'notation',
  'check', 'escaping-check', 'special', 'promotion', 'enpassant', 'draws',
  'opening', 'development', 'opening-danger',
  'tactical-scan', 'forks', 'pins-skewers', 'mating-patterns',
  'thought-process', 'plans', 'phase-guide',
  'king-endgame', 'passed-pawns', 'endgame-conversion',
  'etiquette', 'mastery-path',
]
const lessonOrder = new Map(lessonSequence.map((id, index) => [id, index]))
lessons.sort((a, b) => lessonOrder.get(a.id) - lessonOrder.get(b.id))

lessons.forEach((lesson, index) => {
  const section = courseSections.find(item => item.id === lesson.section)
  lesson.chapter = `${section.number}.${String(courseSections.filter(item => item.id === lesson.section).length ? lessons.slice(0, index + 1).filter(item => item.section === lesson.section).length : 1).padStart(2, '0')}`
})

export const ruleCards = [
  { title: 'Aim and checkmate', text: 'The objective is to checkmate the opposing king: it is attacked and has no legal response. Kings are not captured.', practice: 'objective' },
  { title: 'How games finish', text: 'Win by checkmate, resignation, or a time forfeit when mating remains possible. Draws include stalemate, dead position, agreement, repetition, and move-count rules.', practice: 'draws' },
  { title: 'Castling', text: 'The king moves two squares toward its rook; that rook crosses to the square the king passed. Rights, path, and attacked king-squares all matter.', practice: 'special' },
  { title: 'Promotion', text: 'A pawn reaching the farthest rank must immediately become a queen, rook, bishop, or knight. Extra queens are legal.', practice: 'promotion' },
  { title: 'Touch-move', text: 'Deliberately touch your movable piece: move it. Announce “I adjust” before merely centring a piece.', practice: 'etiquette' },
  { title: 'The clock', text: 'Make the move, then press with the same hand. Do not press before moving, hover, or handle the clock forcefully.', practice: 'etiquette' },
  { title: 'Fair play', text: 'Do not use notes, advice, outside analysis, or unapproved electronic devices. Call the arbiter for help.', practice: 'etiquette' },
]

export const sources = [
  { label: 'FIDE Laws of Chess (effective 1 Jan 2023)', url: 'https://handbook.fide.com/chapter/E012023' },
  { label: 'Lichess Practice curriculum', url: 'https://lichess.org/practice' },
  { label: 'Chess.com Learn to Play', url: 'https://www.chess.com/lessons/learn-to-play' },
  { label: 'Chess.com Opening Principles', url: 'https://www.chess.com/lessons/opening-principles' },
  { label: 'Chess.com Understanding Endgames', url: 'https://www.chess.com/lessons/understanding-endgames' },
  { label: 'chess.js legal move engine', url: 'https://github.com/jhlywa/chess.js' },
]
