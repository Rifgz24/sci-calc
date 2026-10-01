Engineering Scientific Calculator

A modern, high-function scientific calculator web application designed for university students, engineers, and technical users.

The application combines the functionality of a high-end 500+ function scientific calculator with a modern Liquid Glass interface inspired by contemporary iOS/iPadOS design principles.

The goal is not to blindly reproduce a physical calculator's advertised function count. Instead, the application should provide the majority of functions that are genuinely useful for mathematics, physics, engineering, statistics, and Mechanical Engineering.

---

Project Goals

The application should provide:

- Advanced scientific calculations
- Engineering calculations
- Statistics
- Probability
- Equation solving
- Matrix calculations
- Vector calculations
- Complex numbers
- Numerical calculus
- Base-N calculations
- Unit conversion
- Engineering constants
- Function tables
- Calculation history
- Memory and variables
- Keyboard support
- Offline/PWA support
- Modern Liquid Glass UI
- Mobile-first responsive design

The target is roughly 80–90% of the useful functionality normally found across a 500+ function scientific calculator.

Do not artificially inflate the function count with redundant or obscure operations.

---

Design Direction

The visual design should follow a modern Liquid Glass aesthetic.

The interface should feel like a premium native calculator application rather than a traditional web calculator.

Design principles:

- translucent glass surfaces
- background blur
- layered depth
- subtle borders
- soft highlights
- large rounded corners
- restrained gradients
- smooth transitions
- modern typography
- clean spacing
- minimal visual noise

The design may be inspired by modern iOS/iPadOS interfaces, but must not directly copy proprietary Apple UI assets.

The calculator itself should remain the visual focus.

Avoid:

- Bootstrap-style layouts
- excessive gradients
- excessive neon
- overly colorful buttons
- unnecessary shadows
- cluttered scientific-key layouts
- desktop-only layouts
- outdated calculator aesthetics

---

Technology Stack

Preferred stack:

- TypeScript
- React
- Vite
- Tailwind CSS
- CSS variables
- Vitest

Recommended libraries:

- "mathjs" for mathematical operations where appropriate
- "KaTeX" or "MathLive" for mathematical expression rendering/input
- "lucide-react" for icons

Do not put mathematical logic inside React components.

The mathematical engine must be independent from the UI.

Do not use JavaScript "eval()" for expression evaluation.

---

Project Structure

Use a modular structure similar to:

scientific-calculator/
│
├── public/
│   ├── favicon.svg
│   └── icons/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers/
│   │
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx
│   │   │   ├── Display.tsx
│   │   │   ├── Keypad.tsx
│   │   │   ├── CalculatorKey.tsx
│   │   │   ├── FunctionPanel.tsx
│   │   │   └── ModeSelector.tsx
│   │   │
│   │   ├── glass/
│   │   │   ├── GlassPanel.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   └── GlassModal.tsx
│   │   │
│   │   ├── modes/
│   │   │   ├── BasicMode.tsx
│   │   │   ├── ScientificMode.tsx
│   │   │   ├── StatisticsMode.tsx
│   │   │   ├── EquationMode.tsx
│   │   │   ├── MatrixMode.tsx
│   │   │   ├── VectorMode.tsx
│   │   │   ├── ComplexMode.tsx
│   │   │   ├── TableMode.tsx
│   │   │   ├── BaseNMode.tsx
│   │   │   └── ConverterMode.tsx
│   │   │
│   │   ├── history/
│   │   │   ├── HistoryPanel.tsx
│   │   │   └── HistoryItem.tsx
│   │   │
│   │   └── common/
│   │
│   ├── engine/
│   │   ├── parser/
│   │   ├── evaluator/
│   │   ├── functions/
│   │   ├── constants/
│   │   ├── units/
│   │   ├── statistics/
│   │   ├── algebra/
│   │   ├── matrices/
│   │   ├── vectors/
│   │   ├── complex/
│   │   ├── calculus/
│   │   └── baseN/
│   │
│   ├── hooks/
│   │   ├── useCalculator.ts
│   │   ├── useHistory.ts
│   │   ├── useKeyboard.ts
│   │   └── useCalculatorMode.ts
│   │
│   ├── state/
│   │   └── calculatorStore.ts
│   │
│   ├── data/
│   │   ├── functions.ts
│   │   ├── constants.ts
│   │   ├── units.ts
│   │   └── modes.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── liquid-glass.css
│   │   └── animations.css
│   │
│   ├── types/
│   │   └── calculator.ts
│   │
│   └── main.tsx
│
├── tests/
│   ├── engine/
│   ├── parser/
│   ├── statistics/
│   ├── matrices/
│   └── calculus/
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

Do not create a giant monolithic "App.tsx".

Mathematical functionality must remain separated from presentation.

---

Calculator Modes

The application should have the following primary modes:

CALC
STAT
EQN
MATRIX
VECTOR
COMPLEX
TABLE
BASE-N
CONVERTER

The mode selector should use a modern segmented/pill interface.

Switching modes should not unnecessarily destroy application state.

---

CALC Mode

The primary scientific calculator.

Arithmetic

Support:

+
-
×
÷
%
(
)

Powers and Roots

Support:

x²
x³
xʸ
√x
³√x
ʸ√x
1/x

Constants

π
e

Factorial

n!

Trigonometry

sin
cos
tan

sin⁻¹
cos⁻¹
tan⁻¹

Hyperbolic Functions

sinh
cosh
tanh

sinh⁻¹
cosh⁻¹
tanh⁻¹

Logarithms

log
ln
logₐ
10ˣ
eˣ

Angle Units

DEG
RAD
GRAD

Coordinate Conversion

Support:

Rectangular ↔ Polar

Number Formats

Support:

SCI
ENG
FIX
NORM

---

Memory and Variables

Implement:

M+
M-
MR
MC
MS

Support calculator variables:

A
B
C
D
E
F
X
Y
M

Support:

Ans

Example:

5 × 8 =
Ans × 2

---

Fractions

Support:

1/2
3/4 + 5/6
7 1/2

Provide:

fraction → decimal
decimal → fraction
mixed → improper
improper → mixed

Use proper mathematical formatting where possible.

---

STAT Mode

One-Variable Statistics

Implement:

n
Σx
Σx²
mean
variance
sample variance
population variance
standard deviation
sample standard deviation
minimum
maximum
range

Regression

At minimum:

Linear regression
y = a + bx

Calculate:

a
b
r
r²
predicted y
predicted x

Where practical, also implement:

quadratic
exponential
logarithmic
power

A small visualization may be provided for regression.

---

Probability

Implement:

n!
nPr
nCr

Also:

random number
random integer

Where practical, support:

Normal distribution
Binomial distribution
Poisson distribution

---

EQN Mode

Linear Equations

Support:

ax + b = 0

Simultaneous Equations

Support 2-variable systems:

a₁x + b₁y = c₁
a₂x + b₂y = c₂

And 3-variable systems:

x
y
z

Polynomial Equations

Support:

quadratic
cubic
quartic

Display all valid roots.

Support complex roots where appropriate.

---

MATRIX Mode

Support matrices up to at least 4×4.

Operations:

+
-
×
scalar multiplication
transpose
determinant
inverse
identity
matrix power

Also:

solve AX = B

Display matrices using mathematical notation.

---

VECTOR Mode

Support 2D and 3D vectors.

Operations:

addition
subtraction
scalar multiplication
magnitude
unit vector
dot product
cross product
angle between vectors

---

COMPLEX Mode

Represent complex numbers as:

a + bi

Support:

+
-
×
÷

Functions:

abs
arg
conjugate
real
imaginary

Conversions:

rectangular ↔ polar

Support complex powers and roots where practical.

---

CALCULUS

Implement numerical:

derivative
definite integral

Examples:

d/dx (x² + 3x)

and:

∫₀⁵ (2x + 3) dx

Allow the user to specify:

function
variable
evaluation point
lower bound
upper bound

Use numerically stable algorithms.

---

TABLE Mode

Allow users to define:

f(x)

Example:

f(x) = x² + 2x + 1

Generate values using:

Start
End
Step

Example:

x     f(x)

-2    1
-1    0
 0    1
 1    4
 2    9

A graph may optionally be provided.

---

BASE-N Mode

Support:

DEC
BIN
OCT
HEX

Operations:

AND
OR
XOR
NOT
NAND
NOR
XNOR
bit shift

Support conversions between bases.

---

Unit Converter

This application is intended for engineering students, so unit conversion is an important feature.

Length

mm
cm
m
km
in
ft
yd
mile

Area

mm²
cm²
m²
in²
ft²

Volume

mL
L
cm³
m³
in³
ft³

Mass

mg
g
kg
ton
oz
lb

Force

N
kN
dyn
lbf
kgf

Pressure

Pa
kPa
MPa
bar
atm
psi

Energy

J
kJ
cal
kcal
Wh
kWh

Power

W
kW
MW
hp

Temperature

°C
°F
K

Speed

m/s
km/h
mph
ft/s

Time

ms
s
min
h
day

---

Engineering Constants

Provide a searchable constants database.

At minimum:

π
e
speed of light
standard gravity
gravitational constant
Planck constant
elementary charge
Boltzmann constant
Avogadro constant
gas constant
electron mass
proton mass

Organize constants into categories.

---

Expression Engine

Do not use:

eval()

Implement or use a proper mathematical expression parser.

The engine must understand:

2 + 3 × 4
sin(30)
√(25)
2^3
5!
3 × sin(45)

Operator precedence must be mathematically correct.

Support implicit multiplication:

2π
2(5 + 3)
3sin(30)

Handle:

division by zero
invalid factorial
invalid logarithm domain
invalid square root
unmatched parentheses
invalid matrix dimensions

Do not expose raw:

NaN
undefined
Infinity

to users.

Display human-readable mathematical errors.

---

Display

The main display should visually resemble a premium scientific calculator.

Show:

angle mode
calculator mode
memory state
expression
result

Example:

DEG     CALC     M

sin(45) × √25

3.535533906

Support long-expression scrolling.

Use mathematical typography where appropriate.

---

Keyboard Support

Desktop keyboard support is required.

Map:

0-9
+
-
*
/
.
(
)
Enter
Backspace
Escape

Optional scientific shortcuts:

s → sin
c → cos
t → tan
l → log

Do not intercept keyboard input while the user is typing inside normal text fields.

---

History

Store calculation history locally.

Each history item should contain:

expression
result
timestamp

Actions:

reuse
copy
delete
clear all

No account should be required.

Use localStorage or IndexedDB.

---

Liquid Glass UI

The visual system is a major part of the project.

Use:

backdrop-filter: blur(...);
background: rgba(...);
border: 1px solid rgba(...);
border-radius: 28px;

Use glass selectively.

Recommended visual hierarchy:

Background
    ↓
Application Glass Shell
    ↓
Display Glass Panel
    ↓
Function Controls
    ↓
Calculator Keys

Do not turn every element into a floating glass blob.

---

Background

Use a subtle dark background by default.

Recommended:

- near-black/navy base
- very subtle blurred gradients
- low contrast
- slow ambient movement
- no distracting neon

Support:

Dark
Light
System

---

Color

Keep the color system restrained.

Base colors:

white
black
gray
transparent glass

Default accent:

system blue

Optional accents:

purple
green
orange
pink

Accent colors should primarily represent:

- active mode
- selected controls
- focus
- important actions

---

Typography

Use a modern system font stack:

-apple-system,
BlinkMacSystemFont,
"SF Pro Display",
"SF Pro Text",
Inter,
system-ui,
sans-serif;

Use tabular numerals for numerical output.

Large results should have strong visual hierarchy.

---

Responsive Design

Mobile-first design is mandatory.

Support at minimum:

320px
375px
390px
430px
768px
1024px
1440px+

Mobile:

- calculator fills available width
- touch targets remain comfortable
- no page-level horizontal scrolling
- controls remain reachable
- function menus can horizontally scroll

Desktop:

- center calculator
- optionally display history sidebar
- take advantage of available screen width

---

Animations

Use subtle iOS-like transitions.

Recommended duration:

150–300ms

Animate:

- button press
- mode switching
- panels
- history
- theme changes

Respect:

prefers-reduced-motion

Do not animate everything.

---

Accessibility

Support:

- keyboard navigation
- screen readers
- visible focus states
- semantic buttons
- accessible labels
- sufficient contrast
- reduced motion

Every calculator key must have an accessible name.

---

PWA

Make the application installable as a Progressive Web App.

Include:

manifest
service worker
offline support
application icons

After installation, the calculator should work without internet access.

---

Persistence

Persist locally:

theme
accent color
angle mode
calculator mode
memory
history
settings

No login required.

---

Function Registry

Do not hardcode every function directly into UI components.

Create a function registry.

Example:

{
  name: "sin",
  label: "sin",
  category: "trigonometry",
  aliases: ["sin"],
  execute: ...
}

The UI should generate function menus from this registry.

This makes future functionality easier to add.

---

Mode Registry

Use a similar registry for calculator modes:

{
  id: "statistics",
  label: "STAT",
  icon: ...,
  component: ...
}

Adding a new mode should not require rewriting the entire application.

---

UI Layout

The mobile interface should follow this general hierarchy:

┌─────────────────────────┐
│ CALC       DEG      M   │
│                         │
│ sin(45) × √25          │
│                         │
│       3.535533906       │
├─────────────────────────┤
│ CALC STAT EQN MATRIX    │
├─────────────────────────┤
│ sin cos tan log ln ...  │
│                         │
│  7    8    9    ÷    (  │
│  4    5    6    ×    )  │
│  1    2    3    −    π  │
│  0    .    =    +    ⌫  │
└─────────────────────────┘

This is only a structural reference.

Create the final UI according to the actual responsive layout.

---

Important UX Rule

Do not put every available function on the main keypad.

The main keypad must remain clean.

Use:

Primary keypad
+
Function drawer
+
SHIFT
+
ALPHA
+
Mode menus

This provides the flexibility of a physical scientific calculator without making the interface unusable.

---

Settings

Provide a compact settings panel.

Settings:

Theme
Accent color
Angle unit
Number format
Precision
Scientific notation
Haptic feedback
Animations

Haptic feedback may use browser vibration APIs where supported.

The application must remain fully functional without vibration support.

---

Accuracy

Mathematical correctness is critical.

Where appropriate:

- use arbitrary precision
- avoid floating-point artifacts
- separate calculation precision from display precision
- support configurable output precision
- use numerically stable algorithms

Do not display:

0.30000000000000004

when the expected user-facing result is:

0.3

---

Error Handling

The application must never crash because of invalid mathematical input.

Example:

1 / 0

Display:

Math Error
Division by zero

Example:

log(-5)

Display:

Math Error
Invalid logarithm domain

Example:

invalid matrix operation

Display:

Dimension Error

Errors should be concise and understandable.

---

Testing

Use Vitest.

Test at minimum:

basic arithmetic
operator precedence
trigonometry
inverse trigonometry
hyperbolic functions
logarithms
factorial
fractions
statistics
regression
probability
matrix operations
vector operations
complex numbers
equations
derivatives
integrals
unit conversion
Base-N

Include edge cases.

Required examples:

sin(30 DEG) = 0.5
cos(60 DEG) = 0.5
tan(45 DEG) = 1
5! = 120
2^10 = 1024
det([[1,2],[3,4]]) = -2

---

Development Phases

Phase 1 — Foundation

Implement:

- Vite + React + TypeScript
- project architecture
- Liquid Glass design system
- responsive calculator UI
- expression parser
- arithmetic
- scientific functions
- DEG/RAD/GRAD
- memory
- variables
- Ans
- history
- keyboard input

The application must already be usable after Phase 1.

---

Phase 2 — Advanced Mathematics

Implement:

- fractions
- statistics
- probability
- equation solver
- complex numbers
- matrices
- vectors

---

Phase 3 — Engineering Tools

Implement:

- calculus
- Base-N
- unit converter
- engineering constants
- function table
- regression

---

Phase 4 — Product Polish

Implement:

- PWA
- offline support
- settings
- accessibility
- animations
- performance optimization
- comprehensive testing
- mobile optimization
- desktop optimization

---

Phase 5 — Global Currency & Conversion

Implement:

- global quick converter available from the Topbar in every mode
- unit conversion separated from the mathematics engine
- currency conversion using live Frankfurter reference rates
- cached rates with update time, rate date, and stale/offline indication
- full Converter mode with units, currencies, and engineering constants

---

Engineering Rules

The implementation must:

- use TypeScript
- use reusable React components
- separate UI and mathematical logic
- avoid "eval()"
- avoid giant components
- avoid duplicated logic
- avoid unnecessary dependencies
- use proper error handling
- include tests
- maintain responsive behavior
- maintain accessibility
- keep the application functional offline after PWA installation

Do not rewrite working architecture unnecessarily.

Do not sacrifice mathematical correctness for visual effects.

Do not sacrifice mobile usability for desktop aesthetics.

---

Definition of Done

The project is considered complete when:

- the calculator works on mobile
- the calculator works on desktop
- scientific calculations work correctly
- expression precedence is correct
- scientific functions work correctly
- memory and variables work
- history works
- statistics work
- equation solving works
- matrices work
- vectors work
- complex numbers work
- calculus works
- Base-N works
- unit conversion works
- constants are available
- table mode works
- keyboard input works
- errors are handled gracefully
- tests pass
- PWA installation works
- offline functionality works
- UI is responsive
- UI follows the Liquid Glass design direction
- accessibility requirements are satisfied

---

Final Product

The final application should feel like:

«A high-end engineering scientific calculator with the mathematical capabilities of a 500+ function calculator, redesigned as a modern Liquid Glass application for phones and desktops.»

The priority order is:

1. Mathematical correctness
2. Usability
3. Architecture
4. Responsive design
5. Liquid Glass visual quality
6. Performance
7. Animations

Build the application incrementally.

Do not stop after creating a visual mockup.

The final result must be a functional calculator application with a real mathematical engine.
