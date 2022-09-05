/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {H2} from 'components/MDX/Heading';
import {H4} from 'components/MDX/Heading';
import {Challenge} from './Challenge';
import {Navigation} from './Navigation';

interface ChallengesProps {
  children: React.ReactElement[];
  isRecipes?: boolean;
  titleText?: string;
  titleId?: string;
}

export interface ChallengeContents {
  id: string;
  name: string;
  order: number;
  content: React.ReactNode;
  solution: React.ReactNode;
  hint?: React.ReactNode;
}

const parseChallengeContents = (
  children: React.ReactElement[]
): ChallengeContents[] => {
  const contents: ChallengeContents[] = [];

  if (!children) {
    return contents;
  }

  let challenge: Partial<ChallengeContents> = {};
  let content: React.ReactElement[] = [];
  React.Children.forEach(children, (child) => {
    const {props} = child;
    switch (props.mdxType) {
      case 'Solution': {
        challenge.solution = child;
        challenge.content = content;
        contents.push(challenge as ChallengeContents);
        challenge = {};
        content = [];
        break;
      }
      case 'Hint': {
        challenge.hint = child;
        break;
      }
      case 'h3': {
        challenge.order = contents.length + 1;
        challenge.name = props.children;
        challenge.id = props.id;
        break;
      }
      default: {
        content.push(child);
      }
    }
  });

  return contents;
};

export function Challenges({
  children,
  isRecipes,
  titleText = isRecipes ? 'Prueba algunos ejemplos' : 'Prueba algunos desafíos',
  titleId = isRecipes ? 'examples' : 'challenges',
}: ChallengesProps) {
  const challenges = parseChallengeContents(children);
  const totalChallenges = challenges.length;
  const scrollAnchorRef = React.useRef<HTMLDivElement>(null);
  const queuedScrollRef = React.useRef<boolean>(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const currentChallenge = challenges[activeIndex];

  React.useEffect(() => {
    if (queuedScrollRef.current === true) {
      queuedScrollRef.current = false;
      scrollAnchorRef.current!.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  });

  const handleChallengeChange = (index: number) => {
    setActiveIndex(index);
  };

  const Heading = isRecipes ? H4 : H2;
  return (
    <div className="max-w-7xl mx-auto py-4">
      <div
        className={cn(
          'border-gray-10 bg-card dark:bg-card-dark shadow-inner rounded-none -mx-5 sm:mx-auto sm:rounded-lg'
        )}>
        <div ref={scrollAnchorRef} className="py-2 px-5 sm:px-8 pb-0 md:pb-0">
          <Heading
            id={titleId}
            className={cn(
              'mb-2 leading-10 relative',
              isRecipes
                ? 'text-xl text-purple-50 dark:text-purple-30'
                : 'text-3xl text-link'
            )}>
            {titleText}
          </Heading>
          {totalChallenges > 1 && (
            <Navigation
              currentChallenge={currentChallenge}
              challenges={challenges}
              handleChange={handleChallengeChange}
              isRecipes={isRecipes}
            />
          )}
        </div>
<<<<<<< HEAD
        <div className="p-5 sm:py-8 sm:px-8">
          <div key={activeChallenge}>
            <h3 className="text-xl text-primary dark:text-primary-dark mb-2">
              <div className="font-bold block md:inline">
                {isRecipes ? 'Ejemplo' : 'Desafío'} {currentChallenge.order} of{' '}
                {challenges.length}
                <span className="text-primary dark:text-primary-dark">: </span>
              </div>
              {currentChallenge.name}
            </h3>
            <>{currentChallenge.content}</>
          </div>
          <div className="flex justify-between items-center mt-4">
            {currentChallenge.hint ? (
              <div>
                <Button className="mr-2" onClick={toggleHint} active={showHint}>
                  <IconHint className="mr-1.5" />{' '}
                  {showHint ? 'Ocultar pista' : 'Mostrar pista'}
                </Button>
                <Button
                  className="mr-2"
                  onClick={toggleSolution}
                  active={showSolution}>
                  <IconSolution className="mr-1.5" />{' '}
                  {showSolution ? 'Ocultar solución' : 'Mostrar solución'}
                </Button>
              </div>
            ) : (
              !isRecipes && (
                <Button
                  className="mr-2"
                  onClick={toggleSolution}
                  active={showSolution}>
                  <IconSolution className="mr-1.5" />{' '}
                  {showSolution ? 'Ocultar solución' : 'Mostrar solución'}
                </Button>
              )
            )}

            {nextChallenge && (
              <Button
                className={cn(
                  isRecipes
                    ? 'bg-purple-50 border-purple-50 hover:bg-purple-50 focus:bg-purple-50 active:bg-purple-50'
                    : 'bg-link dark:bg-link-dark'
                )}
                onClick={() => {
                  setActiveChallenge(nextChallenge.id);
                  setShowSolution(false);
                }}
                active>
                Próximo {isRecipes ? 'ejemplo' : 'desafío'}
                <IconArrowSmall
                  displayDirection="right"
                  className="block ml-1.5"
                />
              </Button>
            )}
          </div>
          {showHint && currentChallenge.hint}

          {showSolution && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-primary dark:text-primary-dark">
                Solución
              </h3>
              {currentChallenge.solution}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={() => setShowSolution(false)}>
                  Cerrar solución
                </Button>
                {nextChallenge && (
                  <Button
                    className={cn(
                      isRecipes ? 'bg-purple-50' : 'bg-link dark:bg-link-dark'
                    )}
                    onClick={() => {
                      setActiveChallenge(nextChallenge.id);
                      setShowSolution(false);
                      if (scrollAnchorRef.current) {
                        scrollAnchorRef.current.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        });
                      }
                    }}
                    active>
                    Próximo desafío
                    <IconArrowSmall
                      displayDirection="right"
                      className="block ml-1.5"
                    />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
=======
        <Challenge
          key={currentChallenge.id}
          isRecipes={isRecipes}
          currentChallenge={currentChallenge}
          totalChallenges={totalChallenges}
          hasNextChallenge={activeIndex < totalChallenges - 1}
          handleClickNextChallenge={() => {
            setActiveIndex((i) => i + 1);
            queuedScrollRef.current = true;
          }}
        />
>>>>>>> 42561f013aa0f6008cd1c5b811d8bacfc66a0779
      </div>
    </div>
  );
}
