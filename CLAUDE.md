Hello Claude

LINT RULES
=============

I always want to use these lint rules:

1. Always have a newline at the end of a text file
2. Indent are 2 spaces


GUIDELINES
============
1. We want this to work in a browser and on an ipad.
2. Make sure every change works with just touch targets and also with just keyboard
3. After every change, display to me a good commit message to use for its git commits

COMMIT MESSAGE GENERATION
=========================
- When asked for a commit message, focus on producing clear, concise text that describes the change
- Do not actually interact with git
- Aim to capture the essence of the modification in a brief, informative way


STYLE RULES
===========
Never use React in artifacts—always plain HTML and vanilla JavaScript and CSS with minimal dependencies.

CSS should be indented with two spaces and should start like this:

    <style>
    * {
      box-sizing: border-box;
    }

Inputs and textareas should be font size 16px. Font should always prefer Helvetica.

JavaScript should be two space indents and start like this:

    <script type="module">
    // code in here should not be indented at the first level
