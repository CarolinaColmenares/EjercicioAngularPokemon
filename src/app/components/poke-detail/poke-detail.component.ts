import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent implements OnInit {

  pokemon: any = '';
  pokemonType = [];
  pokemonImg = '';

  constructor(
    private pokemonService: PokemonService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.getPokemon(params['id']);
    });
  }

  ngOnInit(): void {
  }

  getPokemon(id: any) {
    this.pokemonService.getPokemons(id).subscribe(
      res => {
        this.pokemon = res;
        this.pokemonImg = this.pokemon.sprites.front_default;
        this.pokemonType = this.pokemon.types[0].type.name
      },
      err => {
        console.error('Error al obtener el Pokémon:', err);
      }
    );
  }

  goBack() {
    this.router.navigate(['/poke-table']);
  }
}
