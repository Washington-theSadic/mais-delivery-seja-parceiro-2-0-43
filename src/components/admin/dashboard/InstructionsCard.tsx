
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InstructionsCard = () => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Instruções</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Use este painel administrativo para gerenciar as campanhas de marketing, imagens da equipe, depoimentos e vídeos exibidos no site.
          </p>
          <p className="text-gray-600 mt-4">
            Clique em uma das seções acima para começar a editar o conteúdo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
