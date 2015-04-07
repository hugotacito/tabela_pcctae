var tabelaPcctae = angular.module('tabela_pcctae', ['angular-loading-bar'])
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
  }]);

function roundup(num){
	return Math.ceil(num * 100) / 100;
}

tabelaPcctae
.directive('reloadSelect', function($timeout) {
	return function(scope, element, attrs, ngModel) {
		$timeout(function() {
			scope.$emit('reloadSelect', element, attrs, ngModel);
		}, 500);
	};
})
.controller('main-controller', ['$scope', '$http', function ($scope, $http) {
	$scope.loaded = null;
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

		$scope.salario_bruto = 	parseFloat($scope.vencimento_basico) + parseFloat($scope.incentivo_qualificacao) + 
								parseFloat($scope.gratificacao_basico) + parseFloat($scope.adicional_insalubridade) + 
								parseFloat($scope.auxilio_preescola) + parseFloat($scope.auxilio_alimentacao) + 
								parseFloat($scope.outras.replace(',', '.')) + parseFloat($scope.auxilio_transporte.replace(',', '.')) + 
								parseFloat($scope.saude_suplementar.replace(',', '.'));
		$scope.salario_bruto = $scope.salario_bruto.toFixed(2);

		$scope.base_inss = 	parseFloat($scope.vencimento_basico) + parseFloat($scope.incentivo_qualificacao) + 
							parseFloat($scope.adicional_insalubridade);
		$scope.base_inss = $scope.base_inss.toFixed(2);
		$scope.base_funpresp = $scope.base_inss;

		if($scope.previdencia_complementar_input){
			$scope.previdencia_complementar = $scope.previdencia_complementar_input.replace(',', '.');
		}

		if ($scope.estrutura){
			if($scope.salario_bruto > $scope.everything[$scope.estrutura].inss[2][0]){
				$scope.bruto_maior_teto = true;
			}
			calcular_previdencia($scope);
			if($scope.funpresp_input){
				calcular_funpresp($scope);
			}
			calcular_irpf($scope);
		}

		$scope.total_desconto = parseFloat($scope.desconto_inss) + parseFloat($scope.previdencia_complementar) + 
								parseFloat($scope.funpresp) + parseFloat($scope.desconto_irpf);
		$scope.total_desconto = $scope.total_desconto.toFixed(2);

		$scope.salario_liquido = $scope.salario_bruto - $scope.total_desconto;
		$scope.salario_liquido = $scope.salario_liquido.toFixed(2);
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
		var teto_inss = scope.everything[scope.estrutura].inss[2][0];
		var percentual_inss = 0;
		var contador = 0;
		var inss = scope.everything[scope.estrutura].inss;

		while((contador < inss.length) && (inss[contador][0] < scope.base_inss)) {
			percentual_inss = inss[contador][1];
			contador++;
		}

		scope.aliquota_inss = parseFloat(percentual_inss * 100).toFixed(2);
		scope.aliquota_inss += '%';
		if (scope.modelo_novo_previdencia_input && (scope.base_inss >= teto_inss)){
			scope.desconto_inss = teto_inss * percentual_inss;
			scope.base_inss = teto_inss.toFixed(2);
		} else {
			scope.desconto_inss = scope.base_inss * percentual_inss;
		}
		scope.desconto_inss = scope.desconto_inss.toFixed(2);
	};

	function calcular_irpf(scope){
		scope.base_irpf = 	parseFloat(scope.vencimento_basico) + parseFloat(scope.incentivo_qualificacao) + 
							parseFloat(scope.gratificacao_basico) - parseFloat(scope.desconto_inss) - 
							parseFloat(scope.previdencia_complementar) - parseFloat(scope.funpresp);
		scope.base_irpf = scope.base_irpf.toFixed(2);
		
		var contador = 0;
		var percentual_irpf = 0;
		var abatimento_irpf = 0;
		var irpf = scope.everything[scope.estrutura].irpf;

		while((contador < irpf.length) && (irpf[contador][0] < scope.base_irpf)) {
			percentual_irpf = irpf[contador][1];
			abatimento_irpf = irpf[contador][2];
			contador++;
		}
		scope.aliquota_irpf = parseFloat(percentual_irpf * 100).toFixed(2);
		scope.aliquota_irpf += '%';
		scope.desconto_irpf = (scope.base_irpf * percentual_irpf) - abatimento_irpf;
		scope.desconto_irpf = parseFloat(scope.desconto_irpf).toFixed(2);
	};

	function calcular_funpresp(scope){
		var teto_inss = scope.everything[scope.estrutura].inss[2][0];
		scope.funpresp = (scope.base_funpresp - teto_inss) * scope.funpresp_input;
		scope.funpresp = scope.funpresp.toFixed(2);
	}

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
    	scope.desconto_irpf = '0,00';
    	scope.previdencia_complementar = '0,00';
    	scope.funpresp = '0,00';
	}
	
	$scope.$on('reloadSelect', function(scope, element, attrs, ngModel){
		jQuery('select').material_select();
		jQuery('.brand-logo').focus().blur();
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
		$scope.percentuais_funpresp = data["percentuais_funpresp"];
    	zerar($scope);
    	$scope.loaded = "true";
    	jQuery('select').material_select();
	})
	.error(function(data, status, headers, config) {
		alert('Erro no acesso aos dados!');
	});
}]);