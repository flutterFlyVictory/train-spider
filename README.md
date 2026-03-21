# Featureful Matrix Client

## How do we handle new features?
I, Kami, wrote an entire paragraph about it in this discussion announcement -> <https://github.com/flutterFlyVictory/train-spider/discussions/2>

## Brainstorming ideas
Overall discussion 
- <https://matrix.to/#/#clockwork:kami.boo>
- Discussion
> [!NOTE] 
> Below are the roadmap features we intend to implement, send in some ideas!

### [Generic](./generic.md)
- Styling that you'd expect with keybinds you'd expect. (Bold, italics, etc.)
- Notes, Expanded notes
- Better bridge integration/support
- Quote support (nheko lacks this somehow)
- Default Gif running
- Video player built-in (might be hard and resource intensive)
- Ublock zapper utility for elements customizability -> refer to [Customizability](#Customizability)
- Custom Emoji and Sticker Usage and Addition support(Since most clients lack proper support for it) 
### [UI](./UI.md)
- Proper padding between current and previous user, proper replies.

### [PINS](./pins.md)
- A pin like discord however it only shows the first 3 lines (3 lines of text not just 3 new lines) per pin.
- An expanded pin as a sidebar.

### [Keybinds](./keybinds.md)

### [Command Pallette](./command_pallette.md)

### [Customizability](./customizability.md)
Customize in the way, you decide the UX, the themes, the animation speed, etc.

## Future roadmap we brainstormed
- Exposed API
- CLI?
- Settings help > a gif playing show the cause and effect
- Federalized ease of moderation
- Federalized tags (between clients, no server interaction)
- Federalized emotes (between clients, no server interaction)
### [Customizability](./customizability.md)
Customize in the way, the UI is like building blocks where you put things where you want.
> This may be a long term goal as it may be really hard.

# Rubric/Rules
## Compatibility
Keyboard mouse and trackpad **must** support each other; 
Basic usage across the board should be:
If my keyboard can enter a keybind to go to a channel outside of the viewable screen, my mouse and trackpad should be able to do it too.

## Uniqueness
Keyboard > mouse > trackpad
If my keyboard is able to open a gui like command pallette via control+k, I should be able to do that on mouse and trackpad for sure.
> If my keyboard can enter a keybind to go to a channel outside of the viewable screen, my mouse and trackpad should be able to do it too.

How about my mouse and trackpad special features? 
Well.. you see, a mouse has a middle click option, which most keyboards or people don't simulate it. Which if you did rebind it, bravo to you! However back to the point;
We allow uniqueness in certain aspects of peripherals -- Trackpad gestures to go back, forward, etc. Middle click to close room^\*1. The keyboard should be able to do those thigns just as easily but in its own unique way i.e. alt+left_arrow to go back, alt+right_arrow to go forward, keybind to close room^*1.
> [!TIP] 
> ^\*1 - Closing room here means close it from view but not leave.
