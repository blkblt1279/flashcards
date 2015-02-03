# flashcards
Flashcard app for the kid to play with.  Prebuild with Yeoman.  Bower components not included.

config file allows loading registered external files (I want him to get used working with multiple files).
registered .json files will load contents as multiple sub modules/decks of flash cards(think along the lines of '3rd grade vocab.json' with inside holding {'week one': {"word":"def", "word2": "def2"}, 'week 2':{...}} etc

3 modes, flashcard, practice & test
flashcard which simply shows definition then term (changes on click)
practice, shows definition, allows guess.  If wrong, displays term below def & goes to next card.  Will repeat missed cards.
test which shows definition and takes guess.  Score at end with list of 'missed' cards.

blank answers allowed, scored as 'incorrect'.  Meant to hold basic vocab, or basic html tags. "&lt;b&gt;":"tag to make text bold" only accepts <b> as answer.  Any other terms used that start with & will be forcefully truncated and have the first 4 symbols replaced with < and the last 4 symbols replaced with >

if .json file registered incorrectly, does not follow the correct format, or flashcard deck specified on dropdown menu an error message will occur.
