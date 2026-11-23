
# 💐 bouquet

**a bouquet, written in code (i think?? haha)**

hi! so this is a bouquet that spins around in your terminal. it blooms, it rotates, and it types out little messages at the bottom. the whole thing is made out of text characters lol. it's just one python file and you don't have to install anything.

> quick note: i'm not a cs or it student. i just got bored and hyperfixated on this for way too long. so sorry if my explanations are awkward haha, i tried my best

> also! fun fact: i only made this for one special someone haha. it was never supposed to be a big public thing, so the messages in it are pretty personal. i'm sharing the code in case you want to make one for your special someone too

<img width="800" height="544" alt="demo (1)" src="https://github.com/user-attachments/assets/1985b168-bff0-4c42-a582-7f6cd94fb980" />


---

## how to run it

1. make sure you have python. i think 3.8 or newer works? (it ran fine on 3.12)
2. download or clone this repo
3. open a terminal in the folder and type this:

```
python bouqet.py
```

if that doesn't work, try `python3 bouqet.py` instead. some computers use that one, idk why

that's it!! nothing to install.

to stop it press **`q`** (`ctrl+c` works too).

**tip:** make your terminal window BIG, or zoom out with `ctrl` and `-`. it looks way better with more space, because there are more characters to draw the flowers with.

## what's in the bouquet

- 27 flowers: 8 roses, 5 daisies/asters, 5 sakura, 4 tulips, 3 lilies, 2 sunflowers. and also 3 round blue hydrangea things
- leaves, lavender, eucalyptus, and baby's breath that twinkles
- the paper wrap, with little hearts printed on it, and tissue paper sticking out the top
- a ribbon with a bow (the tails sway!) and a tiny tag that swings
- twinkling stars, falling hearts, drifting petals, and little fireflies going around the bouquet
- at the start all the flowers bloom one by one, then the messages start typing out

## controls

| key | what it does |
| --- | --- |
| `space` | pause / unpause the spinning |
| `+` / `-` | spin faster / slower |
| `r` | spin the other way |
| `n` | skip to the next message |
| `q` | quit |

## making it yours

since i made this for my special someone, the messages in the file are for them. but you can swap them out for your own!! open `bouqet.py` in any text editor (notepad is fine). near the top there's a part that looks kind of like this (yours will have your own text):

```python
TO_NAME = _env_text("BOUQUET_TO", "")
FROM_NAME = _env_text("BOUQUET_FROM", "you")
SIGNATURE = _env_text("BOUQUET_SIGNATURE", "made with love by " + FROM_NAME)

MESSAGES = [
    "your first message",
    "your second message",
    # add as many as you want!! they take turns
]
```

just change the words inside the quotes. be careful not to delete the quote marks or the commas, python gets mad if you do

- `TO_NAME` is the name that shows at the top as "for ___". leave it as `""` if you don't want a name
- `FROM_NAME` is your name
- `SIGNATURE` is the small line at the very bottom
- `MESSAGES` are the sentences that get typed out, one after another

### or do it without editing the file

you can also set stuff from the terminal. this is the part i understand the least, but it works:

**mac / linux**

```bash
BOUQUET_TO="Anna" BOUQUET_MESSAGE="happy birthday!" python3 bouqet.py
```

**windows powershell**

```powershell
$env:BOUQUET_TO="Anna"; $env:BOUQUET_MESSAGE="happy birthday!"; python bouqet.py
```

**windows cmd**

```bat
set "BOUQUET_TO=Anna" && set "BOUQUET_MESSAGE=happy birthday!" && python bouqet.py
```

### all the settings

| name | what it does | default |
| --- | --- | --- |
| `BOUQUET_TO` | shows "for (name)" at the top. empty = hidden | whatever is in the file |
| `BOUQUET_FROM` | your name | whatever is in the file |
| `BOUQUET_SIGNATURE` | the whole line at the very bottom | whatever is in the file |
| `BOUQUET_MESSAGE` | one message only. replaces the whole list | the `MESSAGES` list |
| `BOUQUET_INTRO` | put `0` to skip the blooming at the start | `1` |
| `BOUQUET_FPS` | frames per second. lower it if it's laggy | `24` |
| `BOUQUET_SPIN` | how fast it spins | `0.55` |
| `BOUQUET_TILT` | how much the camera looks down on it | `0.30` |
| `BOUQUET_CAMERA_DISTANCE` | how far away the camera is. smaller = more dramatic perspective | `4.0` |

### changing the flowers (a little more advanced, sorry)

if you want different flowers:

- the flowers are chosen in a list called `wish` (it's inside `build_scene()`). each line is like `(kind, colors, size)`
- the colors are lists of numbers at the top of the file. those are terminal color codes, from dark to light. you can look up "256 color chart" to find more
- if you change the number in `random.Random(21)`, the flowers end up in different spots. fun to try different numbers!

## how does it work??

honestly i'm not great at explaining this part haha, but basically:

1. the paper, leaves, stems, and ribbon are made of around 9,000 little points in 3D space
2. the flowers are drawn again every frame as tilted circles, so they look round from the front and squished from the side
3. it figures out what's in front of what (so flowers don't poke through the paper), adds some perspective, and makes the side facing the light brighter
4. then every frame gets turned into one big chunk of colored text and printed to the terminal, over and over, really fast. that's the whole trick lol

no extra libraries or anything, it's only python's built-in stuff.

## if something is broken

**the hearts look like `?` or little boxes:** your terminal can't show `♥`. on windows try [Windows Terminal](https://aka.ms/terminal) instead of the old black window, or type `chcp 65001` first

**the colors look weird or dull:** try typing `export TERM=xterm-256color` before running it

**it's laggy:** make the window smaller, or lower the fps like `BOUQUET_FPS=15`

**everything looks tiny or blocky:** make the window bigger, or zoom the terminal out

**the keys don't do anything:** the keys only work in a normal interactive terminal. if you started it some other way it'll still play, you just can't press keys

## license
stay golden sunshine! thanks for reaching all the way here!
 © 2026 Red Ivan Clay
