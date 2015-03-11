var tabelaPcctae = angular.module('tabela_pcctae', []);

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
		if ($scope.estrutura){
			$scope.auxilio_alimentacao = $scope.everything[$scope.estrutura].alimentacao.toFixed(2);
			console.log($scope.classe);
		};
		
		if($scope.estrutura && $scope.preescola){
			$scope.auxilio_preescola = ($scope.everything[$scope.estrutura]["auxilio_preescola"] * $scope.preescola).toFixed(2);  
		};

		if($scope.estrutura && $scope.relacao && $scope.classe && $scope.nivel) {
			$scope.vencimento_basico = $scope.menor_vencimento * $scope.everything[$scope.estrutura].aumento;
			$scope.salto = $scope.classe + $scope.nivel - 2;
			$scope.vencimento_basico = $scope.vencimento_basico * (Math.pow($scope.everything[$scope.estrutura].step, $scope.salto));
			console.log($scope.vencimento_basico);
		}

		if($scope.relacao){
			$scope.percentuais_relacao = jQuery.grep($scope.relacoes, function(e){ return e.key == $scope.relacao; })[0].value;
		};
	};

	$scope.$on('reloadSelect', function(scope, element, attrs, ngModel){
		jQuery('select').material_select();
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
    
    //Salário
    $scope.salario_bruto = '0,00';
    $scope.total_desconto = '0,00';
    $scope.salario_liquido = '0,00';

    //Receitas
    $scope.vencimento_basico = '0,00';
    $scope.incentivo_qualificacao = '0,00';
    $scope.gratificacao_basico = '0,00';
    $scope.adicional_insalubridade = '0,00';
    $scope.auxilio_alimentacao = '0,00';
    $scope.auxilio_preescola = '0,00';
    $scope.auxilio_transporte = '0,00';
    $scope.outras = '0,00';
    $scope.saude_suplementar = '0,00';

    //Despesas
    $scope.base_inss = '0,00';
    $scope.aliquota_inss = '0%';
    $scope.desconto_inss = '0,00';
    $scope.base_irpf = '0,00';
    $scope.aliquota_irpf = '0%';
    $scope.irpf = '0,00';
	})
	.error(function(data, status, headers, config) {
		console.log(data, status, headers, config);
	});
}]);