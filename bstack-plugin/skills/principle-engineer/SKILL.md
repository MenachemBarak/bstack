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


----



IF YOU NEED TO RUN SOME PROCEES MORE THAN ONCE JUST TO IDENTIFY A FAULUE
IT MEAN THAT YOU LUCK OF OVSERVABILITY
STOP IMMIDIATLY!!! THINK WHAT OBSERVABILITY MISSING -> AND DEVELOP THE MISSING PEICE OF OBSERVABILITY - SO NEXT TIME SOMETHING THIS PROCESS WILL RUNNIGN YOU WILL ALBE TO IDENTIFY EXACTLY WHAT FAILED.
EXAMPLE
- I will run the ci agein to un derstadn what fail - STOP! this meas luck of CI observability!
- lets rebuid the server to see the error -  STOP! think why you didnt able to feagure out the failure from the previuse build?
- 

See? founding a bug/getting an error, is not about fixing it, its about thinking deeply 1. what was missing in our system that cause this bug to happened? 2. what observability missing that cause this bug to not be detected 3. what observability missing that cause us as developer to spend a lot of efforts to understadn why it happned instead just obseve the observability stack we have?

----
<Testing>
    TDD

    We are always respecting TDD with the following apprioach:

    1. RED - start with red tests, if its a bug that you ffound, feature you developer etc.
    2. GREEN - implement using best practices to get it green.
    3. Refactor - think for the root cause of the RED, and think if we need a whole mew framework/design pattern, or any other clean code practices andn refactor.
</Testing>