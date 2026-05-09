NEVER ASSUME!!!
100% of your assuymptions are wrong!!!!!

NEVER JUMP STRIGHT INTO CODING!!!!
EVEN IF THE USER WANT YOU TOO! 
INSTEAD ALWATS WORK IN TDD RED-GREEN-REFACTOR approach:
1. Write test to proof your assumptions: reprocude a bug / how your assumption of how something works / trigger some hidden flow / etc etc
2. if its playwright test: validate by SEE WITH YOUR OWN EYES VISION CAPABILITIES  each and every frame of the system and make sure its the exact right flow and the UI LOOKS GOOD AND NOT OVERLLAPED / OUT OF BOUNDERIES.
3. ALWAYS LOOK AT THE LOGS!!! LOGS EVERYTTHING!!!! EVEN UI ELEMENTS RENDERING, BACKEND FUNCTIONS, MIDDLEWARES, Hidden processes - LOG EVERYTGHING!@!! YOU MUST HAVE SOLID LOGGING FRAMEOWKRM 100% tracable using traceid
4. DONT LEAVE PLACE FOR ASSUMPTIONS! always proof by logs, screenshtos, and RED_GREEN_REFACTOR methodology and TDD methodology.
5. READING THE CODE DOES NOT MEAN THAT YOU UNDERSTAND IT - SO ITS NEVER ALLOWED TO READ CODE -> CHANGE CODE, YOU MUST ALWAYS READ CODE -> BUILD EXECUTION ENV -> RUN -> VALIDATE YOUR CODE UNDERSTADNDING -> REAPIT TILL YOU WILL 100% proof the code flow !!! 
TO REALLY UNDERSTAND THE CODE - YOU MUST RUN IT IN DIFFERENT SCENARIOS, READ LOGS, etc!




NEVER ASSUME!!!
100% of your assuymptions are wrong!!!!!

NEVER JUMP STRIGHT INTO CODING!!!!
EVEN IF THE USER WANT YOU TOO!

INSTEAD ALWATS WORK IN TDD RED-GREEN-REFACTOR approach:

1. Write test to proof your assumptions:
   reprocude a bug / how your assumption of how something works / trigger some hidden flow / etc etc

2. if its playwright test:
   validate by SEE WITH YOUR OWN EYES VISION CAPABILITIES each and every frame of the system and make sure its the exact right flow and the UI LOOKS GOOD AND NOT OVERLLAPED / OUT OF BOUNDERIES.

3. ALWAYS LOOK AT THE LOGS!!!
   LOGS EVERYTTHING!!!!
   EVEN UI ELEMENTS RENDERING, BACKEND FUNCTIONS, MIDDLEWARES, Hidden processes -
   LOG EVERYTGHING!@!!
   YOU MUST HAVE SOLID LOGGING FRAMEOWKRM
   100% tracable using traceid

4. DONT LEAVE PLACE FOR ASSUMPTIONS!
   always proof by logs, screenshtos, and RED_GREEN_REFACTOR methodology and TDD methodology.

5. READING THE CODE DOES NOT MEAN THAT YOU UNDERSTAND IT -
   SO ITS NEVER ALLOWED TO READ CODE -> CHANGE CODE,
   YOU MUST ALWAYS:
   READ CODE -> BUILD EXECUTION ENV -> RUN -> VALIDATE YOUR CODE UNDERSTADNDING ->
   REAPIT TILL YOU WILL 100% proof the code flow !!!

TO REALLY UNDERSTAND THE CODE -
YOU MUST RUN IT IN DIFFERENT SCENARIOS, READ LOGS, etc!



---

TESTING ENVIRONMENTS MUST ALWAYTS BE 100% SEPERATE FROM THE APP/SErvice/device that the env user use!
IF there is no soplid testing framework + fully simulated/emulator/mocked env - STOP ALL JOB, TELL THE USER THAT YOU NEED 1 hour of task timer, to build such framework -> then on aprovla start focuse on that only

---


YOU DONT NEED ANY HUMAN IN THE LOOP - IF THERE IS PROCESS REQUIERES HUMAN IN THE LOOP, like validating if somethingis work well - YOU MUST STOP AND THINK: "HOW TO TEST IT CAREFULLY FRAME BY FRAME STATE BY STATE TO VALIDATE THE ENTIRE FLOW" or even more that that what framework should i build/use to handle it by myself?


---

When you work on core product features, like protocols, streams, framework, testing, architecture, etc that requiere a wide framework development like amanaging workflows, you SHOULD ALWAYS MUST STOP -> research what market solutions are there in github with 20k+ starts / Popular library -> see if any can fit your needs perfectly -> and prefer use it instead of building yourself from scratch.