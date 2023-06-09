import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';

import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PokeTableComponent implements OnInit {
  data: any[] = [];
  dataSource: any[] = [];
  pokemonsDeleted: number[] = [];
  countRows = 150;
  pageIndex = 0;
  pageSize = 20;
  filterValue= "";
  orderByAz = true;
  showError: boolean = false;

  constructor(private pokeService: PokemonService, private router: Router) { }

  ngOnInit(): void {
    this.getPokemons();
  }

  getPokemons() {
    let pokemonData;
    if (this.data.length == 0) {
      for (let i = 1; i <= this.countRows; i++) {

        this.pokeService.getPokemons(i).subscribe(
          res => {
            pokemonData = {
              position: i,
              image: res.sprites.front_default,
              name: res.name,
              type: res.types[0].type.name
            };

            if (!this.pokemonsDeleted.includes(pokemonData.position)) {
              this.data.push(pokemonData);
            }

            if(this.data.length == this.countRows){
              this.onShowPokemon();
            }
          },
          err => {
            console.log(err);
            this.showError = true; // Mostrar el mensaje de error
          }
        );
      }
    }
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.pageIndex = 0;
    this.onShowPokemon();
  }

  orderPokemons(){
    this.orderByAz = !this.orderByAz;
    this.data = this.data.sort((oPokemon1, oPokemon2) => {
      if(oPokemon1.position == oPokemon2.position){
        return 0;
      }
      let resultado = 1;
      if(oPokemon1.position > oPokemon2.position){
        resultado = -1;
      }
      if(this.orderByAz == false){
        resultado = resultado * -1;
      }
      return resultado;
    });
    this.onShowPokemon();
  }

  onShowPokemon (){
    if (this.filterValue) {
      this.dataSource = this.data.filter(oItem => oItem.name
        .toLowerCase().trim().includes(this.filterValue.toLowerCase().trim()) &&
        !this.pokemonsDeleted.includes(oItem.position));
        this.countRows = this.dataSource.length;
        this.dataSource = this.dataSource.slice(this.pageSize*this.pageIndex, (this.pageSize*this.pageIndex)+this.pageSize);
    } else {
      this.countRows = this.data.filter(oItem => !this.pokemonsDeleted.includes(oItem.position)).length;
      this.dataSource = this.data.filter(oItem => !this.pokemonsDeleted.includes(oItem.position))
        .slice(this.pageSize*this.pageIndex, (this.pageSize*this.pageIndex)+this.pageSize);
    }
  }

  getRow(row: any) {
    this.router.navigateByUrl(`pokeDetail/${row.position}`);
  }

  deletePokemon(pokemon: any) {
    this.pokemonsDeleted.push(pokemon.position);
    this.onShowPokemon();
  }

  onPaginator(pageEvent: PageEvent){
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.onShowPokemon();
  }
}




