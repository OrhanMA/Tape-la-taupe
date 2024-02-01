# Pseudo code for the game

L'utilisateur entre son nom de joueur

Le nom est enregistré sur son ordinateur local

L'utilisateur sélectionne une vitesse de jeu

Quand l'utilisateur clique sur le bouton démarrer

Le jeu se lance

Un chronomètre de 30 secondes est lancé

Les 10 trous apparaissent

1 :Un taupe apparait aléatoirement dans un des trous

1.a.1 Si l'utilisateur ne fait rien pendant X secondes

1.a.2 la taupe dispairait

1.a.3 le score est diminué de 10 points

retour à l'étape 1

1.b.1 L'utilisateur tape la taupe

1.b.2 La taupe disparait

1.b.3 Le score est augmenté de 10 points

retour à l'étape de 1

Quand le chronomètre de 30 secondes est écoulé

Le jeu s'arrête:

- le chronomètre s'arrête
- une alerte averti l'utilisateur
- les taupes n'apparaissent et n'apparaissent plus
- le score final est affiché

Le score, l'utilisateur et la vitesse de jeu sont enregistrés en local

L'utilisateur peut voir le leaderboard

L'utilisateur peut rejouer

Si il rejoue:

- il peut sélectionner sa vitesse de jeu
- Tous les paramètres de la partie précédente sont réinitialisés

Quand il relance le jeu, retour à l'étape 1

Bonus:

- La taupe s'anime en 3 étapes:
  - danse quand elle apparaît
  - a mal quand l'utilisateur la tape
  - se moque avant de disparaître si elle n'a pas été tapée
- Les différents états de la taupe produisent des sons
- une musique est jouée pendant la partie
- la souris est remplacée par un marteau
