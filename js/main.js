var tabelaPcctae = angular.module('tabela_pcctae', []);
jQuery('#conteudo').hide();
function roundup(num){
	return Math.ceil(num * 100) / 100;
}

tabelaPcctae
.directive('reloadSelect', function($timeout) {
	return function(scope, element, attrs, ngModel) {
		$timeout(function() {
			scope.$emit('reloadSelect', element, attrs, ngModel);
		});
	};
})
.controller('main-controller', ['$scope', '$http', function ($scope, $http) {
	$scope.update = function(){
		zerar($scope);
		if ($scope.estrutura){
			$scope.auxilio_alimentacao = $scope.everything[$scope.estrutura].alimentacao.toFixed(2);
		};
		
		if($scope.estrutura && $scope.preescola){
			$scope.auxilio_preescola = ($scope.everything[$scope.estrutura]["auxilio_preescola"] * $scope.preescola).toFixed(2);  
		};

		if($scope.estrutura && $scope.classe && $scope.nivel) {
			calcular_vencimento_basico($scope);
		}

		if($scope.estrutura && $scope.classe && $scope.nivel && $scope.insalubridade) {
			calcular_insalubridade($scope);
		}
		
		if($scope.estrutura && $scope.classe && $scope.nivel && $scope.relacao && $scope.qualificacao) {
			calcular_gratificacao_qualificacao($scope);
		}
		
		if($scope.gratificacao && $scope.estrutura) {
			calcular_gratificacao_funcao($scope);
		}

		if($scope.auxilio_transporte_input){
			$scope.auxilio_transporte = $scope.auxilio_transporte_input;
		}

		if($scope.outras_input){
			$scope.outras = $scope.outras_input;
		}
		
		if($scope.saude_suplementar_input){
			$scope.saude_suplementar = $scope.saude_suplementar_input;
		}

		$scope.salario_bruto = 	parseFloat($scope.vencimento_basico) + parseFloat($scope.incentivo_qualificacao) + parseFloat($scope.gratificacao_basico) +
								parseFloat($scope.adicional_insalubridade) + parseFloat($scope.auxilio_preescola) + parseFloat($scope.auxilio_alimentacao) + 
								parseFloat($scope.outras.replace(',', '.')) + parseFloat($scope.auxilio_transporte.replace(',', '.')) + parseFloat($scope.saude_suplementar.replace(',', '.'));
		$scope.salario_bruto = $scope.salario_bruto.toFixed(2);

		if($scope.modelo_novo_previdencia_input && $scope.estrutura){
			var percentual = 1;
			var fatores = $scope.everything[$scope.estrutura].inss;
			console.log(fatores, $scope.salario_bruto);
			for (index = 0; index < fatores.length; index++) {
			    if (fatores[index][0] < parseFloat($scope.salario_bruto)){
			    	percentual = 1 + fatores[index][1];
			    } else {
			    	break;
			    }
			}
			console.log(percentual);
		}

		if($scope.previdencia_complementar_input){
			$scope.previdencia_complementar =  $scope.previdencia_complementar_input;
		}
	};

	function calcular_vencimento_basico(scope){
		scope.vencimento_basico = scope.menor_vencimento * scope.everything[scope.estrutura].aumento;
		scope.salto = scope.classe + scope.nivel - 2;
		scope.vencimento_basico = scope.vencimento_basico * (Math.pow(scope.everything[scope.estrutura].step, scope.salto));
		scope.vencimento_basico = scope.vencimento_basico.toFixed(2);
	};

	function calcular_insalubridade(scope){
		scope.adicional_insalubridade = (scope.vencimento_basico * scope.insalubridade).toFixed(2);
	};

	function calcular_gratificacao_qualificacao(scope){
		var indice = scope.qualificacoes.indexOf(scope.qualificacao);
		scope.percentuais_relacao = scope.relacao[indice];
		scope.incentivo_qualificacao = (scope.vencimento_basico * scope.percentuais_relacao).toFixed(2);
	};

	function calcular_gratificacao_funcao(scope){
		var indice = scope.gratificacoes.indexOf(scope.gratificacao);
		scope.gratificacao_basico = scope.everything[scope.estrutura].gratificacoes[indice].toFixed(2);
	};

	function calcular_previdencia(scope){

	};

	function zerar(scope) {
	    //Salário
	    scope.salario_bruto = '0,00';
	    scope.total_desconto = '0,00';
	    scope.salario_liquido = '0,00';

	    //Receitas
	    scope.vencimento_basico = '0,00';
	    scope.incentivo_qualificacao = '0,00';
	    scope.gratificacao_basico = '0,00';
	    scope.adicional_insalubridade = '0,00';
	    scope.auxilio_alimentacao = '0,00';
	    scope.auxilio_preescola = '0,00';
	    scope.auxilio_transporte = '0,00';
	    scope.outras = '0,00';
	    scope.saude_suplementar = '0,00';

	    //Despesas
	    scope.base_inss = '0,00';
	    scope.aliquota_inss = '0%';
	    scope.desconto_inss = '0,00';
	    scope.base_irpf = '0,00';
	    scope.aliquota_irpf = '0%';
    	scope.irpf = '0,00';
	}
	
	$scope.$on('reloadSelect', function(scope, element, attrs, ngModel){
		jQuery('select').material_select();
		jQuery('.brand-logo').focus().blur();
		jQuery('#conteudo').show();
	});

	$http.get('json/properties.json').success(function(data) {
		everything = data
		$scope.everything = data;
		$scope.estruturas = data["estruturas"];
		$scope.qualificacoes = data["qualificacoes"];
		$scope.relacoes = data["relacoes"];
		$scope.classes = data["classes"];
		$scope.niveis = data["niveis"];
		$scope.gratificacoes = data["gratificacoes"];
		$scope.insalubridades = data["insalubridades"];
		$scope.menor_vencimento = data["menor_vencimento"];
		$scope.saude_suplementar_input = data["saude_suplementar"];
		$scope.saude_suplementar = data["saude_suplementar"];
    	zerar($scope);
	})
	.error(function(data, status, headers, config) {
		console.log(data, status, headers, config);
	});
}]);